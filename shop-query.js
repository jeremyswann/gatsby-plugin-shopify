module.exports = `
  {
    shop {
      name
      products(first: 250, sortKey: UPDATED_AT) {
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
`;