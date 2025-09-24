#!/bin/bash

docker push us-central1-docker.pkg.dev/refract0r/refract0r-repo/refract0r-server:1.0

gcloud run deploy refract0r-server \
  --image us-central1-docker.pkg.dev/refract0r/refract0r-repo/refract0r-server:1.0 \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --max-instances 10 \
  --memory 1Gi \
  --cpu 1

gcloud run services update-traffic refract0r-server \
  --to-latest \
  --region us-central1