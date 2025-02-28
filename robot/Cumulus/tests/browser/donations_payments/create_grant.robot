*** Settings ***

Resource        robot/Cumulus/resources/NPSP.robot
Library         cumulusci.robotframework.PageObjects

...             robot/Cumulus/resources/OpportunityPageObject.py
...             robot/Cumulus/resources/NPSP.py
Suite Setup     Run keywords
...             Open Test Browser
...             Setup Test Data
Suite Teardown  Delete Records and Close Browser

***Keywords***
# Sets test data contact and an opportunity for the contact
Setup Test Data
    Setupdata   contact   ${contact1_fields}

*** Variables ***
&{contact1_fields}       Email=test@example.com

*** Test Cases ***
Create Grant
    [Documentation]                      Create a Grant from the UI
    [tags]                             feature:Donations and Payments   unstable     unit

    Go To Page                         Listing
     ...                               Opportunity
    Click Object Button                New
    Wait For Modal                     New                                  Opportunity
    Select Record Type                 Grant
    Populate Field                     Opportunity Name                     Robot $100 grant
    Populate Field                     Amount                               100
    Populate Lookup Field              Account Name                         ${data}[contact][LastName] Household
    Select Value From Dropdown         Stage                                Awarded
    Select Date From Datepicker        Close Date                           Today
    Set Checkbutton To                 Do Not Automatically Create Payment  checked
    Click Modal Button                 Save
    Wait Until Modal Is Closed
    ${grant_name}                      Get Main Header
    Go To Page                         Listing
    ...                                Opportunity
    Click Link                         link=${grant_name}