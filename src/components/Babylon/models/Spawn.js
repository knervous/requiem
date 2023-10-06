
import raceData from '../../../common/raceData.json';
import classData from '../../../common/classData.json';

export class Spawn {
  #data = {};
  constructor(data) {
    this.#data = data;
  }

  get anon() {
    return Boolean(this.#data.anon);
  }
  get face() {
    return this.#data.face ?? 0;
  }
  get name() {
    return this.#data.name ?? '';
  }
  get lastName() {
    return this.#data.last_name;
  }
  get displayedName() {
    const fullName = this.name.replace(/_/g, ' ').replace(/\d+$/, '');
    return this.currentHp <= 0 ? `${fullName}'s corpse` : 
      this.lastName.length ? `${fullName} ${this.lastName}` : fullName;
  }
  get deity() {
    return this.#data.deity;
  }
  get size() {
    return this.#data.size;
  }
  get currentHp() {
    return this.#data.current_hp;
  }
  get maxHp() {
    return this.#data.max_hp;
  }
  get isNpc() {
    return this.#data.is_npc;
  }
  get level() {
    return this.#data.level;
  }
  get playerState() {
    return this.#data.player_state;
  }
  get petOwnerId() {
    return this.#data.pet_owner_id;
  }
  // Loc
  get x() {
    return this.#data.x;
  }
  get y() {
    return this.#data.y;
  }
  get z() {
    return this.#data.z;
  }
  get deltaX() {
    return this.#data.delta_x;
  }
  get deltaY() {
    return this.#data.delta_y;
  }
  get deltaZ() {
    return this.#data.delta_z;
  }
  get heading() {
    return this.#data.heading;
  }
  get runSpeed() {
    return this.#data.runspeed;
  }
  get afk() {
    return this.#data.afk;
  }
  get guildId() {
    return this.#data.guild_id;
  }
  get title() {
    return this.#data.title;
  }
  get helm() {
    return this.#data.helm;
  }
  get race() {
    return this.#data.race;
  }
  get id() {
    return this.#data.spawn_id;
  }
  get raceInfo() {
    return raceData.find(r => r.id === this.race);
  }
  get model() {
    return this.raceInfo?.[this.gender]?.toLowerCase() ?? '';
  }
  get class() {
    return this.#data.class;
  }
  get classInfo() {
    return classData[this.class];
  }
  get gender() {
    return this.#data.gender;
  }
  get boundingRadius() {
    return this.#data.bounding_radius;
  }
  get light() {
    return this.#data.light;
  }
  get equipChest() {
    return this.#data.equip_chest;
  }
  get bodyType() {
    return this.#data.bodytype;
  }
  get hasEquip() {
    return this.race >= 1 && this.race <= 13;
  }
  // Equipment
  get equipment() {
    return {
      head     : { id: this.#data.equipment[0].material, tint: this.#data.equipment_tint[0] },
      chest    : { id: this.#data.equipment[1].material, tint: this.#data.equipment_tint[1] },
      arms     : { id: this.#data.equipment[2].material, tint: this.#data.equipment_tint[2] },
      wrist    : { id: this.#data.equipment[3].material, tint: this.#data.equipment_tint[3] },
      hands    : { id: this.#data.equipment[4].material, tint: this.#data.equipment_tint[4] },
      legs     : { id: this.#data.equipment[5].material, tint: this.#data.equipment_tint[5] },
      feet     : { id: this.#data.equipment[6].material, tint: this.#data.equipment_tint[6] },
      primary  : { id: this.#data.equipment[7].material, tint: this.#data.equipment_tint[7] },
      secondary: { id: this.#data.equipment[8].material, tint: this.#data.equipment_tint[8] },
    };
  }
}