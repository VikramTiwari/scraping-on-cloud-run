# Scraping on Cloud Run

[![Run on Google Cloud](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run)

## How it works

- Once deployed on Cloud Run, the project acts as an API to run your pre-defined scraping task on the URL requested by you.
- Send a cURL request with the URL-to-scrape as query parameter. The response will be the scraped data.

```sh
curl --location --request GET 'https://YOUR_APP_URL?url=https://...'
```

- By default, it's set to get the text of the complete page. You can change it by making your own changes in `script.js`.

## Why this structure?

- Cloud Run allows you to scale (up or down) the number of instances automatically. When you don't have anything to scrape, you can just forget about it without worrying about any cost incurred. When you want to scrape a large set of pages, it will easily scale up for you too
- Cloud Run also allows isolation. You can set the maximum request per container to 1. This will ensure that if a single scraping URL won't cause your large scraping job to crash.

## Fine tuning

- You should re-use a container instance as much as possible. This will speed up your scraping. Based on my experiments, you can set 10 requests per container with a 1GB RAM and 1vCPU allocated to your Cloud Run Service. The downside to this is that if any one of those 10 requests cause the container to crash, you might lose data for all 10 of those requests.
- Add following as container arguments to ensure you get best performance from Docker.

```sh
--ipc=host shm-size=1gb
```

- Increase the request timeout to whatever suits your needs. I tend to go with the max timeout of 1 hour.
