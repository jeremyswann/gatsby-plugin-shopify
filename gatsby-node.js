/**
 * Shopify Storefront API
 * * GraphQL Node for Shopify
 * Useful refs:
 * ? https://github.com/darrenhebner/gatsby-shopify
 * ? https://github.com/edenspiekermann/gatsby-source-shopify-storefront
 */

const fetch = require("node-fetch");
const crypto = require('crypto');
const shopQuery = require('./shop-query');

// TODO: Add Articles
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
