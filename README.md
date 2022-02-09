# Ratings and Reviews API
## Overview
This project is the API endpoint of a storefront backend connecting to data related to product ratings and reviews. 
## Description
### Database
Data was stored in a Postgres database, the schema of which can be found with the project. Data stored consisted of Reviews, Review Photos, and Reviews of specific product Characteristics. 
### Server
The server was built using Node.js/Express.js, and primarily serves the following three endpoints: Getting product-specific reviews, getting metadata for product-specific reviews, and posting a new product review.
## Installation
Note that the steps below only pertain to a local development context. Resources that may help with production-level deployment will be added in the final section.
### Prior Dependencies
This project expects the following to be installed locally: A code editor, Git, Node/NPM, REDIS, and Postgresql. Please refer to the documentation for these for help in installation.
### Project Setup
1. Fork and clone the project down to your local computer.
2. Open a terminal, move to the project directory, and run npm install to install all dependencies.
3. Edit the schema.sql file such that all temporary tables and lines pertaining to copying from files are removed (this project originally required ETL from a number of data sets). 
4. Then run 'psql -U databaseUsername schema.sql'
5. Create a new .env file in the root directory with the following variables (the first 5 pertaining to postgres, the last pertaining to the host port on which you would like the server to run:
  i. PGHOST
  ii. PGUSER
  iii. PGDATABASE
  iv. PGPASSWORD
  v. PGPORT
  vi. PORT. 
NOTE: Please .gitignore your .env file to prevent malicious actors from accessing your sensitive information.
6. If running the server locally, remove the object parameter from the redis.createClient call in controllers.js.
7. Type 'npm run start' in the command line. If everything had been installed correctly, the server should now run!
## Resources for Deployment
1. Setting up AWS EC2 instances (at least two--one for the database and one for the server): https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html
2. A tutorial on how to use Docker: https://github.com/dylanlrrb/Please-Contain-Yourself
3. Suggested postgres settings in order to have your database accessible to remote computers: https://stackoverflow.com/questions/29712228/node-postgres-get-error-connect-econnrefused/42947385#42947385
4. A quick and easy load balancing solution using nginx, if needed: https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/. 
NOTE: If load balancing, you will want to copy servers up to your use case (this project created 3) using AMI and distributing the load across servers accordingly using your preferred setting (this project used leastconn).
5. For help in configuring docker or nginx, please refer to the deployment_settings folder in the root directory.
## Accessing the Current Deployment
### The current deployment can be found on the following endpoint:
ec2-54-144-15-197.compute-1.amazonaws.com
### To test, use the following routes:
ec2-54-144-15-197.compute-1.amazonaws.com/reviews/1
ec2-54-144-15-197.compute-1.amazonaws.com/reviews/meta/1
