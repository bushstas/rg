import Processor from 'app/storages/Processor'

const TWO_HANDED = ['knightsword', 'poleaxe', 'hammer', 'staff', 'lance', 'bow', 'arbalest'];
const WEAPON = ['shortsword'];

class Items {
    isOneHanded(item) {
        let c = this.getClass(item);
        return !TWO_HANDED.has(c) && c != 'bastard';
    }

    isOneOrTwoHanded(item) {
        return this.getClass(item) == 'bastard';
    }

    isTwoHanded(item) {
        return TWO_HANDED.has(this.getClass(item));
    }

    isWeapon(item) {
        return WEAPON.has(this.getClass(item));
    }

    isShield(item) {
        return this.get(item).class == 'shield';
    }

    getClass(item) {
        return this.get(item).class;
    }

    get(item) {
        if (item instanceof Object) {
            return item;
        }
        let s = Processor.getStorage('equip');
        if (s) {
            let equipItem = s.getItem(item);
            if (equipItem instanceof Object) {
                return equipItem;
            }
        }
        s = Processor.getStorage('sack');
        if (s) {
            let sackItem = s.getItem(item);
            if (sackItem instanceof Object) {
                return sackItem;
            }
        }
        return {};        
    }
}

export default new Items;