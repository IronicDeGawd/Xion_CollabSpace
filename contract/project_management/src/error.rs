use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Project with ID {0} already exists")]
    ProjectExists(String),

    #[error("Project with ID {0} not found")]
    ProjectNotFound(String),
}
