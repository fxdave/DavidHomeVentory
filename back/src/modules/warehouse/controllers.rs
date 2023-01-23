use super::repo::{CreateWarehouseEntry, WarehouseEntryInsertedWithPath, WarehouseRepository};
use super::repo::{WarehouseEntry, WarehouseEntryInserted};
use crate::modules::auth::authenticator::Authenticator;
use crate::modules::common::{GenericAuthedResponse, GenericError};
use crate::modules::warehouse::repo;
use serde::{Deserialize, Serialize};
use typescript_type_def::TypeDef;
use yerpc::rpc;

//#[derive(Serialize, Deserialize, Object)]
//pub struct SearchQuery {
//    pub keyword: Option<String>,
//    pub parent_id: Option<String>,
//}

#[derive(Serialize, Deserialize, TypeDef)]
pub struct IndexSuccessResponse {
    pub list: Vec<WarehouseEntryInsertedWithPath>,
}

#[derive(Clone)]
pub struct WarehouseController {
    pub repo: WarehouseRepository,
    pub auth: Authenticator,
}

#[rpc(all_positional, ts_outdir = "./ts-warehouse-api")]
impl WarehouseController {
    pub async fn list(
        &self,
        keyword: Option<String>,
        parent_id: Option<String>,
        token: String,
    ) -> GenericAuthedResponse<IndexSuccessResponse, GenericError> {
        if self.auth.parse_token(&token).is_err() {
            return GenericAuthedResponse::UnauthorizedError;
        }

        let list = self.repo.list(keyword.as_deref(), parent_id.as_deref());

        match list {
            Ok(list) => GenericAuthedResponse::Success(IndexSuccessResponse { list }),
            Err(err) => GenericAuthedResponse::Error(GenericError::from(err)),
        }
    }

    pub async fn delete(
        &self,
        id: String,
        token: String,
    ) -> GenericAuthedResponse<DeleteSuccessResponse, GenericError> {
        if self.auth.parse_token(&token).is_err() {
            return GenericAuthedResponse::UnauthorizedError;
        }
        let removed = self.repo.clone().remove(&id);
        match removed {
            Ok(removed) => GenericAuthedResponse::Success(DeleteSuccessResponse { removed }),
            Err(error) => GenericAuthedResponse::Error(GenericError::from(error)),
        }
    }

    pub async fn create(
        &self,
        data: CreateWarehouseEntry,
        token: String,
    ) -> GenericAuthedResponse<CreateSuccessResponse, GenericError> {
        if self.auth.parse_token(&token).is_err() {
            return GenericAuthedResponse::UnauthorizedError;
        }
        let entry_inserted = self.repo.clone().insert(
            data.id.as_deref(),
            WarehouseEntry {
                name: data.name,
                parent_id: data
                    .parent_id
                    .unwrap_or_else(|| repo::ROOT_PARENT_ID.to_string()),
                variant: repo::WarehouseEntryVariant::Item,
            },
        );
        match entry_inserted {
            Ok(entry_inserted) => {
                GenericAuthedResponse::Success(CreateSuccessResponse { entry_inserted })
            }
            Err(error) => GenericAuthedResponse::Error(GenericError::from(error)),
        }
    }

    pub async fn put(
        &self,
        id: String,
        data: WarehouseEntry,
        token: String,
    ) -> GenericAuthedResponse<CreateSuccessResponse, GenericError> {
        if self.auth.parse_token(&token).is_err() {
            return GenericAuthedResponse::UnauthorizedError;
        }
        let entry_inserted = self.repo.clone().update(&id, data);
        match entry_inserted {
            Ok(entry_inserted) => {
                GenericAuthedResponse::Success(CreateSuccessResponse { entry_inserted })
            }
            Err(error) => GenericAuthedResponse::Error(GenericError::from(error)),
        }
    }

    pub async fn get_or_create(
        &self,
        id: String,
        token: String,
    ) -> GenericAuthedResponse<WarehouseEntryInsertedWithPath, GenericError> {
        if self.auth.parse_token(&token).is_err() {
            return GenericAuthedResponse::UnauthorizedError;
        }

        match self.repo.clone().get_or_create(&id) {
            Ok(entry) => GenericAuthedResponse::Success(entry),
            Err(err) => GenericAuthedResponse::Error(GenericError::from(err)),
        }
    }
}

#[derive(Serialize, Deserialize, TypeDef)]
pub struct DeleteSuccessResponse {
    pub removed: WarehouseEntry,
}

#[derive(Debug, Serialize, Deserialize, TypeDef)]
pub struct CreateSuccessResponse {
    pub entry_inserted: WarehouseEntryInserted,
}
