# linkedinapp

This is a simple application for linkedIn API. What it does is to login using LinkedIn credentials and diplays the employment history.

	Technologies used
	* NodeJS
	* Express
	* HTML/CSS/JavaScript

	Libraries and frameworks
	* Twitter Bootsrap
	* jQuery

	NPM Packages used
	* jsonwebtoken
	* request
	* cheerio

I used JWT for backend authentication and LinkedIn API for social media login details.

#### Problem encountered on creating the app
The linkedIn API was updated last May 12, 2015 and I can't use the following scope r_fullprofile and r_network to fetch the employment history. To obtain these permissions I still need to ask LinkedIn and wait for approval. However due to limited time test for this app, I chose to scrape the data after authentication to make sure the scraped data is valid.