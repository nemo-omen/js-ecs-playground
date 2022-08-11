import { Engine, Component } from 'geotic';

class Health extends Component {
  static properties = {
    value: 50,
  };
}

class HealingFactor extends Component {
  static properties = {
    value: 6,
  };
}

class HitProtection extends Component {
  static properties = {
    value: 5,
  };
}

class Damage extends Component {
  static properties = {
    value: 10,
  };
}

class Name extends Component {
  static properties = {
    value: '',
  };
}

class Description extends Component {
  static properties = {
    value: '',
  };
}
class Alive extends Component { }
class Awake extends Component { }

const engine = new Engine();

const allComponents = [
  Health,
  HealingFactor,
  HitProtection,
  Damage,
  Name,
  Description,
  Alive,
  Awake
];

allComponents.forEach((component) => {
  engine.register(component);
});

const world = engine.createWorld();

const playerCharacter = world.createEntity();
const weapon = world.createEntity();

playerCharacter.addComponent(Health, { value: 60 });
playerCharacter.addComponent(HealingFactor, { value: 5 });
playerCharacter.addComponent(HitProtection, { value: 4 });
playerCharacter.addComponent(Name, { value: 'Farnsburry the Meek' });
playerCharacter.addComponent(Description, { value: 'A rough little man. So thin you can almost see through him.' });
playerCharacter.addComponent(Alive);
playerCharacter.addComponent(Awake);

weapon.addComponent(Damage, { value: 4 });

