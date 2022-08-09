import { createWorld, component, string, number, arrayOf, boolean } from '@javelin/ecs';
import type { World } from '@javelin/ecs';

const world: World = createWorld();

const Health = {
  hitPoints: number,
  regenModifier: number
};

const Bag = {
  capacity: number,
};

const Inventory = {
  bag: arrayOf({ items: arrayOf(number) })
};

const Alive = {
  isLiving: boolean
};

const Conscious = {
  awake: boolean
};

const Character = {
  name: string,
  description: string,
};

const health = component(Health);
const bag = component(Bag);
const inventory = component(Inventory);
const alive = component(Alive);
const conscious = component(Conscious);
const characterComponent = component(Character);

const character = world.create(characterComponent, health, bag, inventory, alive, conscious);

