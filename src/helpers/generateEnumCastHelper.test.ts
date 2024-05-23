import ts, { createPrinter } from "typescript";
import { expect, test } from "vitest";

import { generateEnumCastHelper } from "~/helpers/generateEnumCastHelper";

test("it generates the enum cast helper", () => {
  const [
    namesObjectDeclaration,
    namesTypeDeclaration,
    valuesTypeDeclaration,
    castFunctionDeclaration,
  ] = generateEnumCastHelper([
    {
      name: "FOO",
      dbName: "bar",
      values: [
        { name: "FOO", dbName: "foo" },
        { name: "BAR", dbName: "bar" },
      ],
    },
    {
      name: "Shape",
      dbName: "shape",
      values: [
        { name: "CIRCLE", dbName: "circle" },
        { name: "SQUARE", dbName: "square" },
      ],
    },
  ]);

  const printer = createPrinter();

  const result = printer.printList(
    ts.ListFormat.MultiLine,
    ts.factory.createNodeArray([
      namesObjectDeclaration,
      namesTypeDeclaration,
      valuesTypeDeclaration,
      castFunctionDeclaration,
    ]),
    ts.createSourceFile("", "", ts.ScriptTarget.Latest)
  );

  expect(result).toEqual(`const EnumNames = {
    bar: FOO,
    shape: Shape
} as const;
type EnumNames = typeof EnumNames;
type EnumValues<Name extends keyof EnumNames> = EnumNames[Name][keyof EnumNames[Name]];
export function castEnumValue<Name extends keyof EnumNames, Value extends EnumValues<Name> | null>(name: Name, value: Value | ExpressionWrapper<any, any, Value>): RawBuilder<Value> { return sql<Value> \`\${value}::\${sql.id(name)}\`; }\n`);
});
