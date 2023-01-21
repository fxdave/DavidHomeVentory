#![allow(clippy::unused_async)]

use axum::{extract::State, routing::post, Json, Router};
use axum_server::tls_rustls::RustlsConfig;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{net::SocketAddr, path::PathBuf};
use tower_http::cors::CorsLayer;
use typescript_type_def::TypeDef;
use yerpc::RpcServer;

use crate::modules::{
    auth::{authenticator::Authenticator, controllers::AuthController},
    warehouse::{controllers::WarehouseController, repo::WarehouseRepository},
};

mod modules;

#[tokio::main]
async fn main() {
    let authenticator = Authenticator::new();
    let auth_api = AuthController {
        auth: authenticator.clone(),
    };
    let warehouse_api = WarehouseController {
        repo: WarehouseRepository::new().unwrap(),
        auth: authenticator.clone(),
    };
    let routes = Router::new()
        .route("/api/auth", post(handle_auth_rpc).with_state(auth_api))
        .route(
            "/api/warehouse",
            post(handle_warehouse_rpc).with_state(warehouse_api),
        )
        .layer(CorsLayer::permissive());
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("listening on {addr}");

    let tls_config = RustlsConfig::from_pem_file(
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("..")
            .join("cert.pem"),
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("..")
            .join("key.pem"),
    )
    .await
    .ok();

    match tls_config {
        Some(tls_config) => axum_server::bind_rustls(addr, tls_config)
            .serve(routes.into_make_service())
            .await
            .unwrap(),
        None => {
            println!(
                "Please install certificates, because only HTTPS servers accessible from HTTPS"
            );

            axum::Server::bind(&addr)
                .serve(routes.into_make_service())
                .await
                .unwrap()
        }
    };
}

#[derive(Serialize, Deserialize, TypeDef)]
struct ProcedureCall {
    name: String,
    params: Value,
}

async fn handle_auth_rpc(
    State(rpc_api): State<AuthController>,
    Json(input): Json<ProcedureCall>,
) -> Result<Json<Value>, Json<yerpc::Error>> {
    let result = rpc_api.handle_request(input.name, input.params).await;
    match result {
        Ok(res) => Ok(Json(res)),
        Err(err) => Err(Json(err)),
    }
}

async fn handle_warehouse_rpc(
    State(rpc_api): State<WarehouseController>,
    Json(input): Json<ProcedureCall>,
) -> Result<Json<Value>, Json<yerpc::Error>> {
    let result = rpc_api.handle_request(input.name, input.params).await;
    match result {
        Ok(res) => Ok(Json(res)),
        Err(err) => Err(Json(err)),
    }
}
