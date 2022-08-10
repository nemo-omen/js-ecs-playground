import { createWorld, createQuery, component, string, number, arrayOf, boolean } from '@javelin/ecs';
import type { World } from '@javelin/ecs';
import { createHrtimeLoop } from "@javelin/hrtime-loop";


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

const BattleState = {
  inBattle: boolean
};

const Hit = {
  isHit: boolean,
  damage: number
};

const world: World = createWorld();

const alive = component(Alive);
const bag = component(Bag);
const battleState = component(BattleState);
const characterComponent = component(Character);
const conscious = component(Conscious);
const health = component(Health);
const hit = component(Hit);
const inventory = component(Inventory);

const chars = createQuery(Character, Alive, Conscious);

const character = world.create(characterComponent, hit, health, bag, inventory, alive, conscious, battleState);

const initCharacterSystem = (world: World) => chars((character, [battleState, health, alive, conscious]) => {

  battleState.inBattle = true;
  health.hitPoints = 60;
  alive.isAlive = true;
  // conscious.awake = true;
});

const healthSystem = (world: World) => chars((character, [battleState, hit, health, alive, conscious]) => {

  hit.damage = 5;

  if (battleState.inBattle === true) {
    hit.isHit = true;
    console.log('You are under attack!');
    if (hit.isHit) {
      health.hitPoints = health.hitPoints - hit.damage;
      console.log(`You have been hit for ${hit.damage} hitpoints!`);
      console.log(`Your health is now ${health.hitPoints}!`);
    }
  }

  if (health.hitPoints < 10) {
    conscious.awake = false;
    console.log('You have been knocked unconscious!');
  }

  if (health.hitPoints <= 0) {
    alive.isLiving = false;
    if (battleState.inBattle) battleState.inBattle = false;
    console.log('You are dead!');
  }
});

world.addSystem(initCharacterSystem);
world.addSystem(healthSystem);

function tick(dt: number) {
  world.tick(dt);
}

createHrtimeLoop(world.step, 1000).start();