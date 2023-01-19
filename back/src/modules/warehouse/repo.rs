use serde::{Deserialize, Serialize};
use sled::transaction::ConflictableTransactionError;
use std::{error::Error, fmt::Display};
use typescript_type_def::TypeDef;

#[derive(Clone)]
pub struct WarehouseRepository {
    db: sled::Db,
}

pub const ROOT_PARENT_ID: &str = "ROOT";

impl WarehouseRepository {
    pub fn new() -> Result<Self, Box<dyn Error>> {
        let db = sled::open("./data/warehouse")?;
        Ok(Self { db })
    }

    pub fn insert(
        &mut self,
        id: Option<&str>,
        entry: WarehouseEntry,
    ) -> Result<WarehouseEntryInserted, Box<dyn Error>> {
        let result = self.db.transaction(move |tree| {
            let id: String = if let Some(id) = id {
                id.to_string()
            } else {
                tree.generate_id()?.to_string()
            };
            tree.insert(&*id, &entry)?;
            let parent = tree.get(&entry.parent_id)?;
            if entry.parent_id != ROOT_PARENT_ID && parent.is_none() {
                tree.insert(
                    &*entry.parent_id,
                    &WarehouseEntry {
                        name: format!("Unnamed #{id}"),
                        parent_id: ROOT_PARENT_ID.to_string(),
                        variant: WarehouseEntryVariant::Container,
                    },
                )?;
            }
            if let Some(parent) = parent {
                let mut parent: WarehouseEntry =
                    parent
                        .try_into()
                        .ok()
                        .ok_or(ConflictableTransactionError::Abort(
                            DbError::EntryIsNotFound,
                        ))?;
                parent.variant = WarehouseEntryVariant::Container;
                tree.insert(&*entry.parent_id, &parent)?;
            }

            Ok(WarehouseEntryInserted {
                id,
                entry: entry.clone(),
            })
        });
        Ok(result?)
    }

    pub fn remove(&mut self, id: &str) -> Result<WarehouseEntry, Box<dyn Error>> {
        let deleted: WarehouseEntry = self
            .db
            .remove(id)?
            .ok_or(DbError::EntryIsNotFound)?
            .try_into()?;

        let len = self.list(None, Some(&deleted.parent_id))?.len();

        if len == 0 {
            let mut parent: WarehouseEntry = self.db.get(&deleted.parent_id)?.try_into()?;
            parent.variant = WarehouseEntryVariant::Item;
            self.db.insert(&*deleted.parent_id, &parent)?;
        }

        Ok(deleted)
    }

    pub fn get_or_create(
        &mut self,
        id: &str,
    ) -> Result<WarehouseEntryInsertedWithPath, Box<dyn Error>> {
        let entry: WarehouseEntryInserted = {
            let raw_entry = self.db.get(id)?;
            if let Some(entry) = raw_entry {
                let entry: WarehouseEntry = entry.try_into()?;
                WarehouseEntryInserted {
                    entry,
                    id: id.to_string(),
                }
            } else {
                self.insert(
                    Some(id),
                    WarehouseEntry {
                        name: "Unnamed Container".into(),
                        parent_id: ROOT_PARENT_ID.to_string(),
                        // it's not a container until it has items
                        variant: WarehouseEntryVariant::Item,
                    },
                )?
            }
        };

        let path = self.get_path(&entry.entry.parent_id)?;
        Ok(WarehouseEntryInsertedWithPath {
            entry: entry.entry,
            id: entry.id,
            path,
        })
    }

    pub fn update(
        &mut self,
        id: &str,
        new: WarehouseEntry,
    ) -> Result<WarehouseEntryInserted, Box<dyn Error>> {
        let (old_parent_id, result) = self.db.transaction(move |tree| {
            let mut entry: WarehouseEntry = tree.get(id)?.try_into()?;
            let old_parent_id = entry.parent_id;

            if new.parent_id != ROOT_PARENT_ID {
                let mut parent: WarehouseEntry = tree.get(&new.parent_id)?.try_into()?;
                parent.variant = WarehouseEntryVariant::Container;
                tree.insert(&*new.parent_id, &parent)?;
            }
            entry.parent_id = new.parent_id.clone();
            entry.name = new.name.clone();
            tree.insert(id, &entry)?;
            Ok((
                old_parent_id,
                WarehouseEntryInserted {
                    id: id.to_string(),
                    entry,
                },
            ))
        })?;

        let len = self.list(None, Some(&old_parent_id))?.len();

        if len == 0 {
            let mut parent: WarehouseEntry = self.db.get(&old_parent_id)?.try_into()?;
            parent.variant = WarehouseEntryVariant::Item;
            self.db.insert(&*old_parent_id, &parent)?;
        }

        Ok(result)
    }

    pub fn list(
        &self,
        keyword: Option<&str>,
        parent_id: Option<&str>,
    ) -> Result<Vec<WarehouseEntryInsertedWithPath>, Box<dyn Error>> {
        self.db
            .iter()
            .map(
                |pair_result| -> Result<WarehouseEntryInsertedWithPath, Box<dyn Error>> {
                    let pair = pair_result?;
                    let entry: WarehouseEntry = rmp_serde::from_slice(&pair.1)?;
                    let id = String::from_utf8(pair.0.to_vec())?;
                    let path = self.get_path(&entry.parent_id)?;
                    Ok(WarehouseEntryInsertedWithPath { id, entry, path })
                },
            )
            .filter(|inserted_entry| match inserted_entry {
                Ok(WarehouseEntryInsertedWithPath { entry, .. }) => {
                    let parent_matches = parent_id.map_or(true, |pid| entry.parent_id == pid);
                    let keyword_matches = keyword.map_or(true, |kwd| entry.name.contains(kwd));
                    parent_matches && keyword_matches
                }
                Err(_) => true,
            })
            .collect()
    }

    fn get_path(&self, id: &str) -> Result<Vec<PathSegment>, Box<dyn Error>> {
        let path = if id == ROOT_PARENT_ID {
            vec![PathSegment {
                id: ROOT_PARENT_ID.into(),
                name: "ROOT".into(),
            }]
        } else {
            let entry: WarehouseEntry = self.db.get(id)?.try_into()?;
            let mut path = self.get_path(&entry.parent_id)?;
            path.push(PathSegment {
                id: id.to_string(),
                name: entry.name,
            });
            path
        };

        Ok(path)
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, TypeDef)]
pub enum WarehouseEntryVariant {
    Item,
    Container,
}

#[derive(Debug, Serialize, Deserialize, Clone, TypeDef)]
pub struct WarehouseEntry {
    pub name: String,
    pub parent_id: String,
    pub variant: WarehouseEntryVariant,
}

#[derive(Debug, Serialize, Deserialize, TypeDef)]
pub struct CreateWarehouseEntry {
    pub name: String,
    pub parent_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, TypeDef)]
pub struct WarehouseEntryInserted {
    pub id: String,
    pub entry: WarehouseEntry,
}

#[derive(Debug, Serialize, Deserialize, TypeDef)]
pub struct PathSegment {
    pub id: String,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, TypeDef)]
pub struct WarehouseEntryInsertedWithPath {
    pub id: String,
    pub entry: WarehouseEntry,
    pub path: Vec<PathSegment>,
}

impl TryFrom<&[u8]> for WarehouseEntry {
    type Error = rmp_serde::decode::Error;

    fn try_from(value: &[u8]) -> Result<Self, Self::Error> {
        rmp_serde::from_slice(value)
    }
}

impl TryFrom<sled::IVec> for WarehouseEntry {
    type Error = rmp_serde::decode::Error;

    fn try_from(value: sled::IVec) -> Result<Self, Self::Error> {
        value.to_vec().as_slice().try_into()
    }
}
impl TryFrom<Option<sled::IVec>> for WarehouseEntry {
    type Error = ConflictableTransactionError<DbError>;

    fn try_from(value: Option<sled::IVec>) -> Result<Self, Self::Error> {
        value
            .ok_or(ConflictableTransactionError::Abort(
                DbError::EntryIsNotFound,
            ))?
            .to_vec()
            .as_slice()
            .try_into()
            .map_err(|err| {
                ConflictableTransactionError::Abort(DbError::SomethingWentWrong(Box::new(err)))
            })
    }
}

impl WarehouseEntry {
    fn as_bytes(&self) -> Result<Vec<u8>, ConflictableTransactionError<DbError>> {
        rmp_serde::to_vec(&self).map_err(|err| {
            ConflictableTransactionError::Abort(DbError::SomethingWentWrong(Box::new(err)))
        })
    }
}

#[allow(clippy::fallible_impl_from)]
impl From<&WarehouseEntry> for sled::IVec {
    fn from(value: &WarehouseEntry) -> Self {
        value.as_bytes().unwrap().into()
    }
}
#[allow(clippy::module_name_repetitions)]
#[derive(Debug)]
pub enum DbError {
    EntryIsNotFound,
    SomethingWentWrong(Box<dyn Error>),
}

impl Error for DbError {}

impl Display for DbError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::EntryIsNotFound => write!(f, "entry is not found"),
            Self::SomethingWentWrong(error) => error.fmt(f),
        }
    }
}

impl From<sled::Error> for DbError {
    fn from(value: sled::Error) -> Self {
        Self::SomethingWentWrong(Box::new(value))
    }
}

impl From<sled::transaction::TransactionError> for DbError {
    fn from(value: sled::transaction::TransactionError) -> Self {
        Self::SomethingWentWrong(Box::new(value))
    }
}
