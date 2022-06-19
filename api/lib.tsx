import { renderToFile } from "@react-pdf/renderer"

type RawRecipe = {
  ingredients: string
  instructions: string
}

type Ingredient = {
  quantity: string
  description: string
}


const formatIngredients = (rawIngredients: string): Ingredient[] => {
  return []
}

const formatInstructions = (instructions: string): string[] => {
  return []
}

const FormattedRecipe = (ingredients: Ingredient[], instructions: string[]) => {
  return <div>Formatted PDF</div>
}

export const generatePDF = async (rawRecipe: RawRecipe) => {
  const ingredients = formatIngredients(rawRecipe.ingredients);
  const instructions = formatInstructions(rawRecipe.instructions);

  return renderToFile(<div />, `${process.cwd()}/my-doc.pdf`);

}