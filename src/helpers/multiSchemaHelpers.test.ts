import { expect, test } from "vitest";

import {
  buildMultiSchemaMap,
  convertToMultiSchemaModels,
} from "./multiSchemaHelpers";

const testDataModel = `generator kysely {
  provider        = "node ./dist/bin.js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider = "postgresql"
  schemas  = ["mammals", "birds"]
  url      = env("TEST_DATABASE_URL")
}

model Elephant {
  id   Int    @id
  name String

  @@map("elephants")
  @@schema("mammals")
}

model Eagle {
  id   Int    @id
  name String

  @@map("eagles")
  @@schema("birds")
}`;

test("returns a list of models with schemas appended to the table name", () => {
  const initialModels = [
    { typeName: "Elephant", tableName: "elephants" },
    { typeName: "Eagle", tableName: "eagles" },
  ];

  const multiSchemaMap = buildMultiSchemaMap(testDataModel);
  const result = convertToMultiSchemaModels(multiSchemaMap, initialModels);

  expect(result).toEqual([
    { typeName: "Elephant", tableName: "mammals.elephants" },
    { typeName: "Eagle", tableName: "birds.eagles" },
  ]);
});
