type Shoe = {
  purpose: string
}

class BalletFlat implements Shoe {
  purpose = 'dancing'
}

class Boot implements Shoe {
  purpose = 'woodcutting'
}

class Sneaker implements Shoe {
  purpose = 'walking'
}

type ShoeCreateType = {
  (type: 'balletFlat'): BalletFlat
  (type: 'boot'): Boot
  (type: 'sneaker'): Sneaker
};

const createShoe: ShoeCreateType = (
  type: 'balletFlat' | 'boot' | 'sneaker'
) => {
  switch (type) {
    case 'balletFlat': return new BalletFlat
    case 'boot': return new Boot
    case 'sneaker': return new Sneaker
  }
} 

let Shoe = {
  create: createShoe
}

console.log(Shoe.create('boot'));
console.log(Shoe.create('sneaker'));
