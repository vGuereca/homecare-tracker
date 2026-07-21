# Production Environment Example

This file documents the environment variables that may be used when deploying the Home Maintenance Tracker and Cost Prioritization Application to AWS Lightsail.

This file is an example only. Real production secrets should not be committed to GitLab.

## Example Environment Variables

```properties
POSTGRES_DB=home_maintenance_db
POSTGRES_USER=home_maintenance_user
POSTGRES_PASSWORD=replace_with_secure_password
APP_CORS_ALLOWED_ORIGINS=http://<lightsail-public-ip>,http://<lightsail-public-ip>:3000,http://<lightsail-public-ip>:5173
```text
```text
