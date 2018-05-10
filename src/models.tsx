export type IChildren = JSX.Element[] | JSX.Element | string;

export interface IComponent {
	onClick?: (e: any) => void;
	key?: string | number;
	classes?: string;
	children?: IChildren;
	disabled?: boolean;
}

export interface IConnectedComponent extends IComponent {
	fetching?: boolean;
	doAction: (action: string, props?: any) => {};
	dispatch: (action: string, props?: any) => {};
}

export interface ICheckboxItem {
	value: string;
	label: string;	
}

export interface ILoginFormData {
	login: string;
	password: string;
}

export type IFormData = ILoginFormData;

export interface IFormProps {
	onSubmit?: (formData: IFormData) => void;
}

export interface IFormState {
	data: IFormData;
}

export interface IBattleData {
	enemies: IEnemy[];
	heroCondition: IHeroCondition;
	active: boolean;
}

export interface ITravelData {
	cards: ITravelCard[];
}

export interface IEnemy {
	name: string;
	key: string;
	type: string;
	id: number;
	img: string;
	level: number;
	life: number[];
	active?: boolean;
}

export interface ITravelCard {
	type: string;
	key: string;
}

export interface IHeroCondition {
	life: number[];
	mana: number[];
	stamina: number[];
	effects: IConditionEffect[];
}

export interface IConditionEffect {
	type: EConditionEffectType;
	bonuses: IConditionEffectBonus;
}

export interface IConditionEffectBonus {}

export enum EConditionEffectType { Good, Bad }