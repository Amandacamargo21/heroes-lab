import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  DeleteObjectCommand: jest.fn(),
}));
