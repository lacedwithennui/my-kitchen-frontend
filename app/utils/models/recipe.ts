import { fractionalizeQuantity, pluralizeUnit } from "./measurements.ts";

type UUID = ReturnType<typeof crypto.randomUUID>;

type IngredientJSON = {
    name: string;
    quantity: number;
    unit?: string | null;
    substitutions: SubstitutionJSON[];
    isFullAmountUsedInRecipe?: boolean | null;
};

type SubstitutionJSON = {
    id: UUID;
    originalIngredient: IngredientJSON;
    substitutionIngredients: IngredientJSON[];
    displayScaleFactor?: number | null;
    notes: string | null;
};

type RecipeJSON = {
    name: string;
    subtitle?: string | null;
    description?: string | null;
    ingredients: IngredientJSON[];
    instructions: string[];
    tags: string[];
    thumbnailURL?: string | null;
    prepTimeMinutes?: number | null;
    cookTimeMinutes?: number | null;
};

export class Ingredient {
    private _name: string;
    private _quantity: number;
    private _unit?: string;
    private _substitutions: Substitution[] = [];
    private _isFullAmountUsedInRecipe?: boolean;

    constructor(
        name: string,
        quantity: number,
        unit?: string,
        substitutions: Substitution[] = [],
        isFullAmountUsedInRecipe?: boolean
    ) {
        this._name = name;
        this._quantity = quantity;
        this._unit = unit;
        this._substitutions = substitutions;
        this._isFullAmountUsedInRecipe = isFullAmountUsedInRecipe;
    }

    public static fromJSON(json: IngredientJSON): Ingredient {
        // Nulls should be on JSON only. Missing unit should be undefined in the object.
        return new Ingredient(
            json.name,
            json.quantity,
            json.unit ?? undefined,
            json.substitutions.map((substitution) => Substitution.fromJSON(substitution)),
            json.isFullAmountUsedInRecipe ?? undefined
        );
    }

    public toJSON(): IngredientJSON {
        return {
            name: this._name,
            quantity: this._quantity,
            // Coalesce undefined to null for JSON only
            unit: this._unit ?? null,
            substitutions: this._substitutions.map((substitution) => substitution.toJSON()),
            isFullAmountUsedInRecipe: this._isFullAmountUsedInRecipe ?? null
        };
    }

    public get name(): string {
        return this._name;
    }

    public get quantity(): number {
        return this._quantity;
    }

    public get unit(): string | undefined {
        return this._unit;
    }

    public get substitutions(): Substitution[] {
        return this._substitutions;
    }

    public get isFullAmountUsedInRecipe(): boolean | undefined {
        return this._isFullAmountUsedInRecipe;
    }

    public getFractionalizedQuantity() {
        return fractionalizeQuantity(this.quantity);
    }

    /**
     * Get this ingredient as a string in the format "quantity (unit? )name", e.g.
     * "1 lb ground beef" or "2 eggs"
     * @returns A string representation of the ingredient in the format "quantity (unit? )name"
     */
    public toString(): string {
        return `${this.getFractionalizedQuantity()} ${this._unit ? this._unit + " " : ""}${this._name}`;
    }
}

export class Substitution {
    private _id: UUID;
    private _originalIngredient: Ingredient;
    private _substitutionIngredients: Ingredient[];
    private _displayScaleFactor: number = 1;
    private _notes?: string;

    public constructor(
        id: UUID,
        originalIngredient: Ingredient,
        substitutionIngredients: Ingredient[],
        displayScaleFactor: number = 1,
        notes?: string
    ) {
        this._id = id;
        this._originalIngredient = originalIngredient;
        this._substitutionIngredients = substitutionIngredients;
        this._displayScaleFactor = displayScaleFactor;
        this._notes = notes;
    }

    public static fromJSON(json: SubstitutionJSON): Substitution {
        return new Substitution(
            json.id,
            Ingredient.fromJSON(json.originalIngredient),
            json.substitutionIngredients.map((substitutionIngredient) => Ingredient.fromJSON(substitutionIngredient)),
            json.displayScaleFactor ?? 1,
            json.notes ?? undefined
        );
    }

    public toJSON(): SubstitutionJSON {
        return {
            id: this._id,
            originalIngredient: this._originalIngredient.toJSON(),
            substitutionIngredients: this._substitutionIngredients.map((substitutionIngredient) =>
                substitutionIngredient.toJSON()
            ),
            displayScaleFactor: this._displayScaleFactor,
            notes: this._notes ?? null
        };
    }

    public get id() {
        return this._id;
    }

    public get originalIngredient() {
        return this._originalIngredient;
    }

    public get substitutionIngredients() {
        return this._substitutionIngredients;
    }

    public get displayScaleFactor() {
        return this._displayScaleFactor;
    }

    public get notes() {
        return this._notes;
    }

    public getScaledSubstitutionIngredientStrings() {
        return this._substitutionIngredients.map((substitutionIngredient) => {
            const json = substitutionIngredient.toJSON();
            json.quantity *= this._displayScaleFactor;
            if (json.unit) {
                json.unit = pluralizeUnit(json.unit, json.quantity);
            }
            return Ingredient.fromJSON(json).toString();
        });
    }
}

export class Recipe {
    private _name: string;
    private _subtitle?: string;
    private _description?: string;
    private _ingredients: Ingredient[];
    private _instructions: string[];
    private _tags: string[] = [];
    private _thumbnailURL?: string;
    private _prepTimeMinutes?: number;
    private _cookTimeMinutes?: number;

    public constructor(name: string, ingredients: Ingredient[], instructions: string[]) {
        this._name = name;
        this._ingredients = ingredients;
        this._instructions = instructions;
    }

    public withSubtitle(subtitle?: string): Recipe {
        this._subtitle = subtitle;
        return this;
    }

    public withDescription(description?: string): Recipe {
        this._description = description;
        return this;
    }

    public withTags(tags: string[] = []): Recipe {
        this._tags = tags;
        return this;
    }

    public withThumbnail(thumbnailURL?: string): Recipe {
        if (!thumbnailURL) {
            return this;
        }
        try {
            const thumbnailURLasURL = new URL(thumbnailURL);
            if (thumbnailURLasURL.protocol !== "https:") {
                throw new Error("Image URLs must be secure (starting with 'https://').");
            }
            this._thumbnailURL = thumbnailURL;
        } catch {
            throw new Error("Invalid thumbnail URL (is it really a URL?)");
        }
        return this;
    }

    public withPrepTime(prepTimeMinutes?: number): Recipe {
        this._prepTimeMinutes = prepTimeMinutes;
        return this;
    }

    public withCookTime(cookTimeMinutes?: number): Recipe {
        this._cookTimeMinutes = cookTimeMinutes;
        return this;
    }

    public static fromJSON(json: RecipeJSON): Recipe {
        // Nulls should be on JSON only. Missing unit should be undefined in the object.
        return new Recipe(
            json.name,
            json.ingredients.map((ingredient) => Ingredient.fromJSON(ingredient)),
            json.instructions
        )
            .withSubtitle(json.subtitle ?? undefined)
            .withDescription(json.description ?? undefined)
            .withTags(json.tags)
            .withThumbnail(json.thumbnailURL ?? undefined)
            .withPrepTime(json.prepTimeMinutes ?? undefined)
            .withCookTime(json.cookTimeMinutes ?? undefined);
    }

    public toJSON(): RecipeJSON {
        return {
            name: this._name,
            subtitle: this._subtitle ?? null,
            description: this._description ?? null,
            ingredients: this._ingredients.map((ingredient) => ingredient.toJSON()),
            instructions: this._instructions,
            tags: this._tags,
            thumbnailURL: this._thumbnailURL ?? null,
            prepTimeMinutes: this._prepTimeMinutes ?? null,
            cookTimeMinutes: this._cookTimeMinutes ?? null
        };
    }

    public get name(): string {
        return this._name;
    }

    public get subtitle(): string | undefined {
        return this._subtitle;
    }

    public get description(): string | undefined {
        return this._description;
    }

    public get ingredients(): Ingredient[] {
        return this._ingredients;
    }

    public get instructions(): string[] {
        return this._instructions;
    }

    public get tags(): string[] | undefined {
        return this._tags;
    }

    public get thumbnailURL(): string | undefined {
        return this._thumbnailURL;
    }

    public get prepTimeMinutes(): number | undefined {
        return this._prepTimeMinutes;
    }

    public get cookTimeMinutes(): number | undefined {
        return this._cookTimeMinutes;
    }

    public get totalTimeMinutes(): number | undefined {
        const totalTime = (this._prepTimeMinutes || 0) + (this._cookTimeMinutes || 0);
        return totalTime > 0 ? totalTime : undefined;
    }

    public prepTimeFormatted(): string | undefined {
        if (this._prepTimeMinutes === undefined) return undefined;
        const hours = Math.floor(this._prepTimeMinutes / 60);
        const minutes = this._prepTimeMinutes % 60;
        return `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? " " + minutes + "m" : ""}`;
    }

    public cookTimeFormatted(): string | undefined {
        if (this._cookTimeMinutes === undefined) return undefined;
        const hours = Math.floor(this._cookTimeMinutes / 60);
        const minutes = this._cookTimeMinutes % 60;
        return `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? " " + minutes + "m" : ""}`;
    }

    public totalTimeFormatted(): string | undefined {
        const totalTime = this.totalTimeMinutes;
        if (totalTime === undefined) return undefined;
        const hours = Math.floor(totalTime / 60);
        const minutes = totalTime % 60;
        return `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? " " + minutes + "m" : ""}`;
    }

    public ingredientsFormatted(): string[] {
        return this._ingredients.map((ingredient) => ingredient.toString());
    }
}
