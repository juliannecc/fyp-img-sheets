# Images from Repo to Google Sheets
A Custom GitHub Action that puts images from a repository to google sheets.

### Usage
Add the code below to a `.yml` file. Make sure secrets are set accordingly.
```
name: Images from Repo to Google Sheets

# Controls when the workflow will run
on:
  push:
    branches: [ "main" ]

  workflow_dispatch:

jobs:
  job1: 
    runs-on: ubuntu-latest
    outputs:
      output1: ${{ steps.step1.outputs.test }}
    steps:
      -  uses: jitterbit/get-changed-files@v1
         id: abc
         with:
          format: space-delimited
          token: ${{ secrets.GITHUB_TOKEN }}
      - id: step1
        run: echo "test=${{ steps.abc.outputs.added }}" >> $GITHUB_OUTPUT
      
  job2:
    runs-on: ubuntu-latest
    needs: job1
    steps:      
      - run: echo "${{needs.job1.outputs.output1}}"
      - name: Call FYP Image to Sheets
        uses: juliannecc/fyp-img-sheets@main
        with:
          added_files: ${{needs.job1.outputs.output1}}
          private_key_id: ${{ secrets.PRIVATE_KEY_ID }}
          client_email: ${{ secrets.CLIENT_EMAIL }}
          client_id: ${{ secrets.CLIENT_ID }}
          client_x509_cert_url: ${{ secrets.CLIENT_X509_CERT_URL }}
          spreadsheetid: ${{ secrets.spreadsheetid }}
          owner: ${{ github.repository_owner }}
          repo: ${{ github.event.repository.name }}
          private_key: |
            ${{ secrets.PRIVATE_KEY }}
```
