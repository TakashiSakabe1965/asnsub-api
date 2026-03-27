# HINDP (GitHub Actions → ECR → CloudFormation → ECS Fargate + NEW ALB)

同一AWSアカウント・同一VPC上で、**HINDP専用のECSクラスターとALBを新規作成**してテストするための最小構成です。

## エンドポイント
- `http://<ALB_DNS>/asnsub-api/hindp?pn=...`
- `http://<ALB_DNS>/health`

## GitHub Secrets（必須）
- `AWS_ROLE_TO_ASSUME` : OIDC AssumeRole 用 IAM ロール ARN
- `AWS_REGION` : 例 `ap-northeast-1`
- `ECR_REPOSITORY` : 例 `hindp`
- `STACK_NAME` : 例 `hindp-ecs-stack-test`
- `VPC_ID`, `SUBNET1`, `SUBNET2`
- `ALB_SG_ID`, `ECS_SG_ID`
- `ASSIGN_PUBLIC_IP` : `ENABLED`（テストはこれ推奨） / `DISABLED`

## ローカル確認
```bash
npm ci
npm test
npm start
curl "http://localhost:3000/asnsub-api/hindp?pn=01234567890123456789"
```

## Docker
```bash
docker build -t hindp:local .
docker run --rm -p 3000:3000 hindp:local
curl "http://localhost:3000/asnsub-api/hindp?pn=01234567890123456789"
```
