# Octoprint Graphql

This project is a thin shim on top of octoprint's standard REST Api.
Not all API routes are covered currently, but the ones that are here work as expected.
There is currently enough functionality to choose an existing file on your octoprint
instance, manually preheat your printer, and manage the print job

PRs are welcome :)

To run:
Set the OCTOPRINT_URL environment variable to the url of the server.
Additionally, set API_KEY to the api key for the user you want to
act as on your api user.
