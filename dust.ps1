param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Prompt
)

$body = @{
    message = @{
        content = $Prompt
        mentions = @(
            @{
                configurationId = $env:DUST_AGENT_ID
            }
        )
    }
    title = "Terminal chat"
    blocking = $true
    spaceId = $env:DUST_SPACE_ID
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
    -Method Post `
    -Uri "https://dust.tt/api/v1/w/$($env:DUST_WORKSPACE_ID)/assistant/conversations" `
    -Headers @{
        Authorization = "Bearer $($env:DUST_TOKEN)"
    } `
    -ContentType "application/json" `
    -Body $body |
    ConvertTo-Json -Depth 20