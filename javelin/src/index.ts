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

const healthSystem = (world: World) => chars((character, [battleState, hit, health, alive, conscious]) => {

  if (battleState.inBattle === true) {
    if (hit.isHit) {
      health.hitPoints -= hit.damage;
    }
  }

  if (health.hitPoints < 10) {
    conscious.awake = false;
  }

  if (health.hitPoints <= 0) {
    alive.isLiving = false;
  }
});

world.addSystem(healthSystem);

function tick(dt: number) {
  world.tick(dt);
}

const loop = createHrtimeLoop(1000, clock => tick(clock.dt));