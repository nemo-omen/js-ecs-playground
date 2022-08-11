import {

  createWorld,
  addEntity,
  removeEntity,

  Types,

  defineComponent,
  addComponent,
  removeComponent,
  hasComponent,

  defineQuery,
  Changed,
  Not,
  enterQuery,
  exitQuery,

  defineSerializer,
  defineDeserializer,

  pipe,

} from 'bitecs';

import Loop from 'accurate-game-loop';

const world = createWorld();

world.name = 'The Ferry';

const playerCharacter = addEntity(world);
const actor = addEntity(world);

const Health = defineComponent({ hitpoints: Types.i8, regenFactor: Types.i8 });
const DamageFactor = defineComponent({ value: Types.i8 });
const Living = defineComponent();
const Conscious = defineComponent();
const name = defineComponent({ value: Types.string });

addComponent(world, Health, playerCharacter);
addComponent(world, Health, actor);

const initSystem = (world) => {
  const hasHealthQuery = defineQuery([Health]);
  const ents = hasHealthQuery(world);

  for (let ent of ents) {
    addComponent(world, Living, ent);
    addComponent(world, Conscious, ent);
    addComponent(world, DamageFactor, ent);
    Health.hitpoints[ent] = 60;
    Health.regenFactor[ent] = 6;
    DamageFactor.value[ent] = 10;
  }

  return world;
};

const healthReductionSystem = (world) => {

  const thisQuery = defineQuery([Health, DamageFactor, Living, Conscious]);
  const ents = thisQuery(world);

  for (let ent of ents) {
    Health.hitpoints[ent] = Health.hitpoints[ent] - DamageFactor.value[ent];
  }

  return world;
};

initSystem(world);

console.log(Health.hitpoints[playerCharacter]);

const livingConcsiousQuery = defineQuery([Living, Conscious]);
const livingConsciousEnts = livingConcsiousQuery(world);
const serialize = defineSerializer(world);
const deserialize = defineDeserializer(world);

console.log(livingConsciousEnts);

const toBattle = () => {
  healthReductionSystem(world);
  console.log(`Health of ${playerCharacter} is ${Health.hitpoints[playerCharacter]}`);
  console.log(`Health of ${actor} is ${Health.hitpoints[actor]}`);
  checkDead();
};

const loopTime = 1;
const loop = new Loop(toBattle, loopTime);

function checkDead() {
  const isAnyoneDead = (Health.hitpoints[actor] <= 0 || Health.hitpoints[playerCharacter] <= 0);
  if (isAnyoneDead) {
    console.log('Someone died!');
    loop.stop();
  }
}

console.log('world: ', world);

loop.start();
