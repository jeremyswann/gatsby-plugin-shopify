# gatsby-plugin-shopify
Shopify Storefront GraphQL Plugin for Gatsby

## Install

```javascript
// TODO: Upload to NPM
// npm i -s gatsby-plugin-shopify
```

## How to use

```javascript
// * In your gatsby-config.js
  plugins: [
    {
      resolve: 'gatsby-plugin-shopify',
      options: { 
        // ? storeName: https://<storeName>.myshopify.com/)
        shopName: 'mineralswim',
        // ? docs: https://help.shopify.com/api/storefront-api/getting-started
        accessToken: '68450c650f556fade2cf32720dbf806b',
      },
    },
  ]
```

### GraphQL query to get all products
```
`
{
    shop {
      name
      products(first: 250) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id
            title
            description
            descriptionHtml
            createdAt
            handle
            onlineStoreUrl
            productType
            publishedAt
            updatedAt
            vendor
            variants(first: 10) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    originalSrc
                    altText
                  }
                  weight
                  weightUnit
                  price
                }
              }
            }
            images(first: 10) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  id
                  originalSrc
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`
```

## Site's `gatsby-node.js` example

If you wish to create Gatsby Pages for each Shopify product, you can modify your `gatsby-node.js`.

```javascript
const fetch = require("node-fetch");
const crypto = require('crypto');
const shopQuery = require('./shop-query');

const PRODUCTS = "products";

exports.sourceNodes = async (
  { boundActionCreators },{ shopName, accessToken }
) => {
  const { createNode } = boundActionCreators;

  function processDatum(datum, nodeType) {
    return {
      ...datum.node,
      parent: null,
      children: [],
      internal: {
        type: nodeType,
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(datum))
          .digest(`hex`)
      }
    };
  }

  const data = await fetch(`https://${shopName}.myshopify.com/api/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": accessToken
    },
    body: JSON.stringify({ query: shopQuery })
  }).then(data => data.json());

  if (isValidResponseForProducts(data)) {
    const response = data.data;
    response.shop.products.edges.forEach(datum => {
      createNode(processDatum(datum, PRODUCTS));
    });
  }

  return;
};

// ? Helper functions

function isValidResponse(responseData) {
  if (responseData && responseData.data) {
    return true;
  }
  return false;
}

function isValidResponseForProducts(responseData) {
  if (
    isValidResponse(responseData) &&
    responseData.data.shop &&
    responseData.data.shop.products &&
    responseData.data.shop.products.edges
  ) {
    return true;
  }
  return false;
}
```
