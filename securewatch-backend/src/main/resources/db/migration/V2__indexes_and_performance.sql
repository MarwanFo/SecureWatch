-- V2__indexes_and_performance.sql
-- Indexation stratégique pour optimiser les performances des requêtes analytiques et d'authentification

CREATE INDEX idx_users_tenant_email ON users(tenant_id, email);
CREATE INDEX idx_sessions_user_status ON sessions(user_id, statut);
CREATE INDEX idx_alerts_tenant_severity ON alerts(tenant_id, severity);
CREATE INDEX idx_logs_chain ON logs(timestamp, log_id);
