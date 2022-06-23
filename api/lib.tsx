import { Font, renderToFile } from "@react-pdf/renderer";
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import Fuse from "fuse.js";
import emoji from "@stdlib/datasets-emoji";

const fuzzySearch = new Fuse(emoji(), {
  keys: ["name", "group", "short_name", "description", "aliases", "keywords"],
  includeMatches: true,
  ignoreLocation: true,
});

const getEmoji = (label: string) => {
  const icon: any = fuzzySearch.search(label.split(/\d+/)?.[1]?.trim())?.[0]
    ?.item;

  return icon?.emoji;
};

type RawRecipe = {
  ingredients: string;
  instructions: string;
  title: string;
};

type Ingredient = {
  label: string;
  icon: string;
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  section: {
    margin: 20,
    padding: 0,
    flexGrow: 1,
  },
});

const extractIngredient = (rawIngredient: string): Ingredient => {
  return {
    icon: getEmoji(rawIngredient || ""),
    label: rawIngredient,
  };
};

const formatIngredients = (rawIngredients: string): Ingredient[] => {
  return rawIngredients
    .split("\n")
    .map((line: string) => extractIngredient(line));
};

const formatInstructions = (rawInstructions: string): string[] => {
  return rawInstructions.split("\n").map((line) => line.trim());
};

const FormattedRecipe = (props: {
  ingredients?: Ingredient[];
  instructions?: string[];
}) => {
  console.log(props.ingredients);
  return (
    <div>
      <Text>Ingredients</Text>
      {props.ingredients.map((ingredient) => (
        <Text key={ingredient.label}>
          {ingredient.icon} {ingredient.label}
        </Text>
      ))}
      <Text>Instructions</Text>
      {props.instructions.map((instruction) => (
        <Text key={instruction}>{instruction}</Text>
      ))}
    </div>
  );
};

export const generatePDF = async (rawRecipe: RawRecipe) => {
  const ingredients = formatIngredients(rawRecipe.ingredients);
  const instructions = formatInstructions(rawRecipe.instructions);

  Font.registerEmojiSource({
    format: "png",
    url: "https://twemoji.maxcdn.com/2/72x72/",
  });

  return renderToFile(
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>{rawRecipe.title}</Text>
          <FormattedRecipe
            ingredients={ingredients}
            instructions={instructions}
          />
        </View>
      </Page>
    </Document>,
    `${process.cwd()}/my-doc.pdf`
  );
};

generatePDF({
  title: "Mushroom Chicken",
  ingredients:
    "400g chicken breast\n100g mushrooms\n20cL full cream\n2 spoons Herbes de Provence\n2 onions\n2 tbsp Paprika",
  instructions:
    "Cook the onions\nAdd the mushrooms\nAdd the herbs\nGrill the chicken separately\nYou're done!",
});
