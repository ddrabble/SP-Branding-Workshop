<#
.SYNOPSIS
Enables the Responsive UI on a target SharePoint 2013 or SharePoint 2016 on-premises site collection.
.EXAMPLE
PS C:\> .\provisionIA.ps1 -TargetSiteUrl "https://intranet.mydomain.com/sites/targetSite"
.EXAMPLE
PS C:\> $creds = Get-Credential
PS C:\> .\provisionIA.ps1 -TargetSiteUrl "https://intranet.mydomain.com/sites/targetSite" -Credentials $creds
#>
[CmdletBinding()]
param
(
    [Parameter(Mandatory = $true, HelpMessage="Enter the URL of the target site collection, e.g. 'https://intranet.mydomain.com/sites/targetSite'")]
    [String]
    $TargetSiteUrl,

    [Parameter(Mandatory = $false, HelpMessage="Optional administration credentials")]
    [PSCredential]
    $Credentials
)

# If the Infrastructure Site URL is not provided, we will fallback to the Target Site URL
if($Credentials -eq $null)
{
	$Credentials = Get-Credential -Message "Enter Admin Credentials"
}

Write-Host -ForegroundColor White "--------------------------------------------------------"
Write-Host -ForegroundColor White "|               Enabling Responsive UI                 |"
Write-Host -ForegroundColor White "--------------------------------------------------------"

Write-Host -ForegroundColor Yellow "Target Site URL: $targetSiteUrl"

try
{
    Connect-SPOnline $TargetSiteUrl -Credentials $Credentials

    #AuditSettings, ComposedLook, CustomActions, ExtensibilityProviders, Features, Fields, Files, Lists, Pages, Publishing, RegionalSettings, SearchSettings, SitePolicy, SupportedUILanguages, TermGroups, Workflows, SiteSecurity, ContentTypes, PropertyBagEntries, PageContents, WebSettings, All
    Apply-SPOProvisioningTemplate -Path .\Provision-IA.xml -Handlers ContentTypes

    Write-Host -ForegroundColor Green "Provision IA application succeeded"
}
catch
{
    Write-Host -ForegroundColor Red "Exception occurred!" 
    Write-Host -ForegroundColor Red "Exception Type: $($_.Exception.GetType().FullName)"
    Write-Host -ForegroundColor Red "Exception Message: $($_.Exception.Message)"
}