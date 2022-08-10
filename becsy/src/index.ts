import { component, field, system, System, Type, World } from '@lastolivegames/becsy';

const world = async () => await World.create();

@component class Health {
  @field({ type: Type.number, default: 50 }) declare value: number;
}

@component class Damage {
  @field({ type: Type.number, default: 5 }) declare value: number;
}

world.createEntity(Health);

@system class LogHealth extends System {
  entities = this.query(q => q.current.with(Health).read);

  execute() {
    for (const entity of this.entities.current) {
      const health = entity.read(Health);
      console.log(`Entity with ordinal ${entity.ordinal} has component Health={value: ${health.value}}`);
    }
  }
}

@system class ReduceHealthSystem extends System {
  entities = this.query(
    q => q.current.with(Health).write.and.with(Damage).read
  );

  execute() {
    for (const entity of this.entities.current) {
      const damage = entity.read(Damage).value;
      const health = entity.write(Health).value;

      health.value -= damage.value;
    }
  }
}

async function run(delay: number) {
  await world.execute();
  setTimeout(() => {
    run;
  }, delay);
}

run(1000);