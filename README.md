# backtickify

A templating system based on javascript's built-in backtick templating

TODO: Add sample template and data

Templates look like this (TODO Better example):
```javascript
Templatize`
## Additional Information
${'cryptoassets.other_instructions'}
`()

export default Templatize`
# Crypto Asset Inventory for ${ 'grantor.full_name' }

${ 'meta' }

## Wallets
I use the following wallets to access and store my cryptoassets:

${ 'cryptoassets.wallets' }

${ 'cryptoassets.trusted_helpers'}

${ 'cryptoassets.other_instructions' }

--- END OF DOCUMENT ---
`({
'cryptoassets.wallets': each(Wallet),
'cryptoassets.trusted_helpers': TrustedHelpers,
'cryptoassets.other_instructions': AdditionalInformation,
'meta': Header,
})

```

TODO Document the syntax
