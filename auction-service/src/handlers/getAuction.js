import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();
export const getAuctionById = async (id) => {
  let auction;
  try {
    const result = await dynamodb
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();
    auction = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  return auction;
};

async function getAuction(event, context) {
  const { id } = event.pathParameters;

  let auction = await getAuctionById(id);

  if (!auction) {
    throw new createError.NotFound(`Auction with ID "${id}" not found...`);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}
export const handler = commonMiddleware(getAuction);
