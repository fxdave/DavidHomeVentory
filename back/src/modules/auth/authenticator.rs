use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use rand::Rng;
use serde::{Deserialize, Serialize};

const SECRET_SIZE: usize = 512;

#[derive(Clone)]
pub struct Authenticator {
    secret: [u8; SECRET_SIZE],
    db: sled::Db,
}

impl Authenticator {
    pub fn new() -> Self {
        Self {
            secret: Self::generate_secret(),
            db: sled::open("data/auth").unwrap(),
        }
    }

    fn generate_secret() -> [u8; SECRET_SIZE] {
        let mut data = [0u8; SECRET_SIZE];
        rand::thread_rng().fill(&mut data);
        data
    }

    fn get_token(&self) -> Result<String, jsonwebtoken::errors::Error> {
        let my_claims = Claims {
            exp: 0
        };
        encode(
            &Header::default(),
            &my_claims,
            &EncodingKey::from_secret(&self.secret),
        )
    }

    pub fn parse_token(
        &self,
        token: &str,
    ) -> Result<TokenData<Claims>, jsonwebtoken::errors::Error> {
        let mut validation = Validation::default();
        validation.validate_exp = false;
        decode::<Claims>(token, &DecodingKey::from_secret(&self.secret), &validation)
    }

    pub fn set_password(&mut self, password: &str) -> Result<(), Box<dyn std::error::Error>> {
        self.db
            .insert("password", &*bcrypt::hash(password.as_bytes(), 10)?)?;
        Ok(())
    }

    pub fn is_password_set(&self) -> Result<bool, Box<dyn std::error::Error>> {
        Ok(self.db.get("password")?.is_some())
    }

    pub fn verify_password(
        &self,
        password: &str,
    ) -> Result<String, Box<dyn std::error::Error>> {
        let hash = self.db.get("password")?;

        if let Some(hash) = hash {
            let hash = String::from_utf8(hash.to_vec())?;
            let result = bcrypt::verify(password.as_bytes(), &hash)?;
            if result {
                return Ok(self.get_token()?);
            }
        }

        Err(Box::new(InvalidPasswordError))
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    exp: usize
}

#[derive(Debug, derive_more::Display, derive_more::Error)]
pub struct InvalidPasswordError;
