use axum::http::StatusCode;
use derive_more::{Display, Error};
use serde::{Deserialize, Serialize};
use typescript_type_def::TypeDef;

#[derive(Debug, Display, Serialize, Deserialize, Error, TypeDef)]
#[display(fmt = "{error}")]
pub struct GenericError {
    pub error: String,
    #[serde(skip)]
    pub status: u16,
}

impl From<Box<dyn std::error::Error>> for GenericError {
    fn from(value: Box<dyn std::error::Error>) -> Self {
        Self {
            error: value.to_string(),
            status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
        }
    }
}

impl From<GenericError> for yerpc::Error {
    fn from(value: GenericError) -> Self {
        Self {
            code: value.status.into(),
            data: None,
            message: value.error,
        }
    }
}

#[derive(Serialize, Deserialize, TypeDef)]
pub struct GenericMessage {
    pub message: String,
}

#[derive(Serialize, Deserialize, TypeDef)]
#[serde(tag = "type")]
pub enum GenericResponse<T, E> {
    Success(T),
    Error(E),
}


#[derive(Serialize, Deserialize, TypeDef)]
#[serde(tag = "type")]
pub enum GenericAuthedResponse<T, E> {
    Success(T),
    Error(E),
    UnauthorizedError
}
