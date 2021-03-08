In you AWS console, create an S3 bucket with name `processed-tasks-bucket`

<br/>

Configure AWS CLI in your terminal with
```bash
aws config
```
<br/>

Install Serverless as a global npm package
```bash
npm install -g serverless
```
<br/>

Install local dependencies
```bash
npm install
```
<br/>

If you want, change the `region` in `serverless.yml`

<br/>

Deploy the service
```bash
serverless deploy
```

<br/>

Login to AWS Console and locate `task-processing-statemachine-dev` under the Step Functions service.

Start an execution and observe the created files in `processed-tasks-bucket` S3 bucket. 

