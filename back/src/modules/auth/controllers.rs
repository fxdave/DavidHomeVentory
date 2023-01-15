use crate::modules::{
    auth::authenticator::Authenticator,
    common::{GenericError, GenericResponse},
};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use typescript_type_def::TypeDef;
use yerpc::rpc;

#[derive(Serialize, Deserialize, TypeDef)]
pub struct AuthRequestBody {
    pub password: String,
}

#[derive(Serialize, Deserialize, TypeDef)]
pub struct AuthResponseSuccess {
    pub token: String,
}

#[derive(Clone)]
pub struct AuthController {
    pub auth: Authenticator,
}

#[rpc(all_positional, ts_outdir = "./ts-auth-api")]
impl AuthController {
    pub async fn authenticate(
        &self,
        data: AuthRequestBody,
    ) -> GenericResponse<AuthResponseSuccess, GenericError> {
        let verification = self.auth.verify_password(&data.password);
        if let Ok(token) = verification {
            return GenericResponse::Success(AuthResponseSuccess { token });
        }
        GenericResponse::Error(GenericError {
            status: StatusCode::UNAUTHORIZED.into(),
            error: "It was unable to authenticate you".into(),
        })
    }

    pub async fn set_password(&self, data: AuthRequestBody) -> SetPasswordResponse {
        let mut auth = self.auth.clone();
        match auth.is_password_set() {
            Ok(is_set) if !is_set => match auth.set_password(&data.password) {
                Ok(_) => SetPasswordResponse::Success {
                    message: "Password has been set successfully".into(),
                },
                _ => SetPasswordResponse::GenericError {
                    message: "Something went wrong.".into(),
                },
            },
            Ok(_) => SetPasswordResponse::PasswordHasAlreadyBeenSetError {
                message: "The password had been set already.".into(),
            },
            Err(_) => SetPasswordResponse::GenericError {
                message: "Something went wrong.".into(),
            },
        }
    }
}

#[derive(Serialize, Deserialize, TypeDef)]
#[serde(tag = "type")]
pub enum SetPasswordResponse {
    Success { message: String },
    PasswordHasAlreadyBeenSetError { message: String },
    GenericError { message: String },
}