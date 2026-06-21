export type FlashCard = {
  word: string;
  sentence?: string;
  image?: string | null;
  emoji: string;
  color: string;
};

export const LETTER_MAP: Record<string, FlashCard[]> = {
  a: [
    { emoji: '🍎', word: 'Apple', color: '#E07070' },
    { emoji: '🐜', word: 'Ant', color: '#8B6040' },
    { emoji: '✈️', word: 'Airplane', color: '#70A0D0' },
    { emoji: '🥑', word: 'Avocado', color: '#6B8E50' },
    { emoji: '🐊', word: 'Alligator', color: '#5F8B4C' },
  ],
  b: [
    { emoji: '🐻', word: 'Bear', color: '#C0956C' },
    { emoji: '🍌', word: 'Banana', color: '#E0C040' },
    { emoji: '🐦', word: 'Bird', color: '#70A0D0' },
    { emoji: '🦋', word: 'Butterfly', color: '#B070D0' },
    { emoji: '🚌', word: 'Bus', color: '#E0A040' },
  ],
  c: [
    { emoji: '🐱', word: 'Cat', color: '#E8A060' },
    { emoji: '🚗', word: 'Car', color: '#E07070' },
    { emoji: '🎂', word: 'Cake', color: '#E0B0C0' },
    { emoji: '🐄', word: 'Cow', color: '#A09070' },
    { emoji: '🍪', word: 'Cookie', color: '#C0956C' },
  ],
  d: [
    { emoji: '🐶', word: 'Dog', color: '#C09860' },
    { emoji: '🦆', word: 'Duck', color: '#E0C040' },
    { emoji: '🐬', word: 'Dolphin', color: '#5090B0' },
    { emoji: '🦕', word: 'Dinosaur', color: '#70B080' },
    { emoji: '🍩', word: 'Donut', color: '#D08060' },
  ],
  e: [
    { emoji: '🐘', word: 'Elephant', color: '#A0A0B0' },
    { emoji: '🥚', word: 'Egg', color: '#E0D8C0' },
    { emoji: '🦅', word: 'Eagle', color: '#8B6040' },
    { emoji: '👁️', word: 'Eye', color: '#70A0D0' },
  ],
  f: [
    { emoji: '🐟', word: 'Fish', color: '#70A0D0' },
    { emoji: '🐸', word: 'Frog', color: '#60A060' },
    { emoji: '🌸', word: 'Flower', color: '#E0A0B0' },
    { emoji: '🦊', word: 'Fox', color: '#E08040' },
    { emoji: '🦩', word: 'Flamingo', color: '#E07090' },
  ],
  g: [
    { emoji: '🍇', word: 'Grape', color: '#9070B0' },
    { emoji: '🦒', word: 'Giraffe', color: '#D0A040' },
    { emoji: '🐐', word: 'Goat', color: '#A09070' },
    { emoji: '👻', word: 'Ghost', color: '#B0B0C0' },
    { emoji: '🦍', word: 'Gorilla', color: '#606060' },
  ],
  h: [
    { emoji: '🐴', word: 'Horse', color: '#B08860' },
    { emoji: '🏠', word: 'House', color: '#E08060' },
    { emoji: '❤️', word: 'Heart', color: '#E07070' },
    { emoji: '🦛', word: 'Hippo', color: '#A090B0' },
    { emoji: '🐔', word: 'Hen', color: '#C09860' },
  ],
  i: [
    { emoji: '🍦', word: 'Ice Cream', color: '#E0B0C0' },
    { emoji: '🦎', word: 'Iguana', color: '#60A060' },
    { emoji: '🐛', word: 'Insect', color: '#90B060' },
  ],
  j: [
    { emoji: '🪼', word: 'Jellyfish', color: '#B070D0' },
    { emoji: '🧃', word: 'Juice', color: '#E0A040' },
    { emoji: '🤡', word: 'Joker', color: '#E07070' },
  ],
  k: [
    { emoji: '🪁', word: 'Kite', color: '#70B0D0' },
    { emoji: '🐨', word: 'Koala', color: '#A0A0B0' },
    { emoji: '🔑', word: 'Key', color: '#D0B040' },
    { emoji: '🤴', word: 'King', color: '#D0A040' },
    { emoji: '🦘', word: 'Kangaroo', color: '#C09860' },
  ],
  l: [
    { emoji: '🦁', word: 'Lion', color: '#D0A040' },
    { emoji: '🍃', word: 'Leaf', color: '#60A060' },
    { emoji: '🍋', word: 'Lemon', color: '#E0D040' },
    { emoji: '🐞', word: 'Ladybug', color: '#E07070' },
    { emoji: '🍭', word: 'Lollipop', color: '#D070B0' },
  ],
  m: [
    { emoji: '🌙', word: 'Moon', color: '#E0D070' },
    { emoji: '🐵', word: 'Monkey', color: '#C0956C' },
    { emoji: '🐭', word: 'Mouse', color: '#A0A0B0' },
    { emoji: '🥛', word: 'Milk', color: '#D0D0E0' },
    { emoji: '🍄', word: 'Mushroom', color: '#D07060' },
  ],
  n: [
    { emoji: '🥜', word: 'Nut', color: '#C0A070' },
    { emoji: '👃', word: 'Nose', color: '#E0B090' },
    { emoji: '🪺', word: 'Nest', color: '#B09060' },
  ],
  o: [
    { emoji: '🐙', word: 'Octopus', color: '#D07090' },
    { emoji: '🍊', word: 'Orange', color: '#E09030' },
    { emoji: '🦉', word: 'Owl', color: '#B08860' },
    { emoji: '🦦', word: 'Otter', color: '#A08060' },
  ],
  p: [
    { emoji: '🐧', word: 'Penguin', color: '#606080' },
    { emoji: '🐷', word: 'Pig', color: '#E0A0B0' },
    { emoji: '🍕', word: 'Pizza', color: '#E0A040' },
    { emoji: '🐼', word: 'Panda', color: '#707070' },
    { emoji: '🍑', word: 'Peach', color: '#E0A080' },
  ],
  q: [
    { emoji: '👑', word: 'Queen', color: '#D0B040' },
    { emoji: '🐦', word: 'Quail', color: '#B09070' },
  ],
  r: [
    { emoji: '🌈', word: 'Rainbow', color: '#D08080' },
    { emoji: '🐰', word: 'Rabbit', color: '#E0B0C0' },
    { emoji: '🚀', word: 'Rocket', color: '#E07050' },
    { emoji: '🌹', word: 'Rose', color: '#D06070' },
    { emoji: '🤖', word: 'Robot', color: '#A0A0B0' },
  ],
  s: [
    { emoji: '☀️', word: 'Sun', color: '#E0C040' },
    { emoji: '⭐', word: 'Star', color: '#E0D040' },
    { emoji: '🐍', word: 'Snake', color: '#60A060' },
    { emoji: '🍓', word: 'Strawberry', color: '#E06060' },
    { emoji: '🐑', word: 'Sheep', color: '#C0C0C0' },
  ],
  t: [
    { emoji: '🐯', word: 'Tiger', color: '#E0A040' },
    { emoji: '🌳', word: 'Tree', color: '#60A060' },
    { emoji: '🚂', word: 'Train', color: '#E07050' },
    { emoji: '🐢', word: 'Turtle', color: '#60A080' },
    { emoji: '🍅', word: 'Tomato', color: '#E06040' },
  ],
  u: [
    { emoji: '☂️', word: 'Umbrella', color: '#7080C0' },
    { emoji: '🦄', word: 'Unicorn', color: '#D070D0' },
  ],
  v: [
    { emoji: '🎻', word: 'Violin', color: '#A07050' },
    { emoji: '🌋', word: 'Volcano', color: '#E07050' },
    { emoji: '🚐', word: 'Van', color: '#70A0D0' },
  ],
  w: [
    { emoji: '🐋', word: 'Whale', color: '#5090B0' },
    { emoji: '🍉', word: 'Watermelon', color: '#60A060' },
    { emoji: '🐺', word: 'Wolf', color: '#808090' },
    { emoji: '🪱', word: 'Worm', color: '#D08080' },
  ],
  x: [
    { emoji: '🎵', word: 'Xylophone', color: '#C07090' },
  ],
  y: [
    { emoji: '🧶', word: 'Yarn', color: '#D08090' },
    { emoji: '🪀', word: 'Yo-yo', color: '#E07050' },
  ],
  z: [
    { emoji: '🦓', word: 'Zebra', color: '#707070' },
    { emoji: '⚡', word: 'Zap', color: '#E0D040' },
  ]
};

// —— 布鲁伊词汇库（默认）——
// 卡片：{ word, sentence, image(可空), emoji, color }
// image 为空时回退到 emoji。素材见 assets/bluey/，源自 Bluey 官方素材或生图。
export const BLUEY_CARDS: Record<string, FlashCard[]> = {
  a: [
    { word: 'Apple', sentence: 'A red apple.', image: 'assets/bluey/apple.png', emoji: '🍎', color: '#E07070' },
    { word: 'Arm', sentence: 'Wave your arm.', image: 'assets/bluey/arm.png', emoji: '💪', color: '#E0A060' },
    { word: 'Ant', sentence: 'A little ant.', image: 'assets/bluey/ant.png', emoji: '🐜', color: '#8B6040' },
    { word: 'Alligator', sentence: 'A big alligator.', image: 'assets/bluey/alligator.png', emoji: '🐊', color: '#5F8B4C' },        { word: 'Airplane', sentence: 'An airplane flies.', image: 'assets/bluey/airplane.png', emoji: '✈️', color: '#70A0D0' },
    { word: 'Avocado', sentence: 'A green avocado.', image: 'assets/bluey/avocado.png', emoji: '🥑', color: '#6B8E50' },

  ],
  b: [
    { word: 'Bluey', sentence: 'This is Bluey.', image: 'assets/bluey/bluey.png', emoji: '🐶', color: '#5090C0' },
    { word: 'Ball', sentence: 'Bounce the ball.', image: 'assets/bluey/ball.png', emoji: '⚽', color: '#70A0D0' },
    { word: 'Banana', sentence: 'A yellow banana.', image: 'assets/bluey/banana.png', emoji: '🍌', color: '#E0C040' },
    { word: 'Baby', sentence: 'A little baby.', image: 'assets/bluey/baby.png', emoji: '👶', color: '#E0B0C0' },        { word: 'Bird', sentence: 'A bird sings.', image: 'assets/bluey/bird.png', emoji: '🐦', color: '#70A0D0' },
    { word: 'Bus', sentence: 'A yellow bus.', image: 'assets/bluey/bus.png', emoji: '🚌', color: '#E0A040' },
    { word: 'Bear', sentence: 'A big bear.', image: 'assets/bluey/bear.png', emoji: '🐻', color: '#8B6040' },
    { word: 'Butterfly', sentence: 'A pretty butterfly.', image: 'assets/bluey/butterfly.png', emoji: '🦋', color: '#B070D0' },
    { word: 'Bat', sentence: 'A little bat flies.', image: 'assets/bluey/bat.png', emoji: '🦇', color: '#7A5A78' },

  ],
  c: [
    { word: 'Cat', sentence: 'A cat says meow.', image: 'assets/bluey/cat.png', emoji: '🐱', color: '#E8A060' },
    { word: 'Car', sentence: 'A little red car.', image: 'assets/bluey/car.png', emoji: '🚗', color: '#E07070' },
    { word: 'Cup', sentence: 'Drink from a cup.', image: 'assets/bluey/cup.png', emoji: '🥤', color: '#E0A040' },
    { word: 'Cookie', sentence: 'A yummy cookie.', image: 'assets/bluey/cookie.png', emoji: '🍪', color: '#C0956C' },        { word: 'Cake', sentence: 'A birthday cake.', image: 'assets/bluey/cake.png', emoji: '🎂', color: '#E0B0C0' },
    { word: 'Cow', sentence: 'A cow says moo.', image: 'assets/bluey/cow.png', emoji: '🐄', color: '#A09070' },

  ],
  d: [
    { word: 'Dad', sentence: 'Dad is here.', image: 'assets/bluey/dad.png', emoji: '🐶', color: '#5090C0' },
    { word: 'Dog', sentence: 'A dog says woof.', image: 'assets/bluey/dog.png', emoji: '🐶', color: '#C09860' },
    { word: 'Duck', sentence: 'A duck says quack.', image: 'assets/bluey/duck.png', emoji: '🦆', color: '#E0C040' },
    { word: 'Door', sentence: 'Open the door.', image: 'assets/bluey/door.png', emoji: '🚪', color: '#E08060' },        { word: 'Dinosaur', sentence: 'A big dinosaur.', image: 'assets/bluey/dinosaur.png', emoji: '🦕', color: '#70B080' },

  ],
  e: [
    { word: 'Egg', sentence: 'A little egg.', image: 'assets/bluey/egg.png', emoji: '🥚', color: '#E0D8C0' },
    { word: 'Ear', sentence: 'We hear with our ears.', image: 'assets/bluey/ear.png', emoji: '👂', color: '#E0B090' },
    { word: 'Eye', sentence: 'We see with our eyes.', image: 'assets/bluey/eye.png', emoji: '👁️', color: '#70A0D0' },
    { word: 'Elephant', sentence: 'A big elephant.', image: 'assets/bluey/elephant.png', emoji: '🐘', color: '#A0A0B0' },
  ],
  f: [
    { word: 'Fish', sentence: 'A fish swims.', image: 'assets/bluey/fish.png', emoji: '🐟', color: '#70A0D0' },
    { word: 'Frog', sentence: 'A green frog.', image: 'assets/bluey/frog.png', emoji: '🐸', color: '#60A060' },
    { word: 'Flower', sentence: 'A pretty flower.', image: 'assets/bluey/flower.png', emoji: '🌸', color: '#E0A0B0' },
    { word: 'Foot', sentence: 'Stomp your foot.', image: 'assets/bluey/foot.png', emoji: '🦶', color: '#E0B090' },
  ],
  g: [
    { word: 'Goat', sentence: 'A goat says maa.', image: 'assets/bluey/goat.png', emoji: '🐐', color: '#A09070' },
    { word: 'Giraffe', sentence: 'A tall giraffe.', image: 'assets/bluey/giraffe.png', emoji: '🦒', color: '#D0A040' },
    { word: 'Gift', sentence: 'A birthday gift.', image: 'assets/bluey/gift.png', emoji: '🎁', color: '#D070B0' },
    { word: 'Grapes', sentence: 'Purple grapes.', image: 'assets/bluey/grapes.png', emoji: '🍇', color: '#9070B0' },
  ],
  h: [
    { word: 'Hat', sentence: 'Wear a hat.', image: 'assets/bluey/hat.png', emoji: '🎩', color: '#606060' },
    { word: 'Hand', sentence: 'Clap your hands.', image: 'assets/bluey/hand.png', emoji: '✋', color: '#E0B090' },
    { word: 'House', sentence: 'Our cozy house.', image: 'assets/bluey/house.png', emoji: '🏠', color: '#E08060' },
    { word: 'Horse', sentence: 'A horse says neigh.', image: 'assets/bluey/horse.png', emoji: '🐴', color: '#B08860' },        { word: 'Hen', sentence: 'A hen clucks.', image: 'assets/bluey/hen.png', emoji: '🐔', color: '#C09860' },

  ],
  i: [
    { word: 'Ice', sentence: 'Ice is cold.', image: 'assets/bluey/ice.png', emoji: '🧊', color: '#70A0D0' },
    { word: 'Indy', sentence: 'Indy is a friend.', image: 'assets/bluey/indy.png', emoji: '🐶', color: '#70A0D0' },
    { word: 'Ice Cream', sentence: 'Yummy ice cream.', image: 'assets/bluey/icecream.png', emoji: '🍦', color: '#E0B0C0' },
    { word: 'Igloo', sentence: 'A little igloo.', image: 'assets/bluey/igloo.png', emoji: '🛖', color: '#70A0D0' },
  ],
  j: [
    { word: 'Juice', sentence: 'A glass of juice.', image: 'assets/bluey/juice.png', emoji: '🧃', color: '#E0A040' },
    { word: 'Jump', sentence: 'Jump up high!', image: 'assets/bluey/jump.png', emoji: '🤸', color: '#70A0D0' },
    { word: 'Jam', sentence: 'Strawberry jam.', image: 'assets/bluey/jam.png', emoji: '🍯', color: '#D07050' },
    { word: 'Jellyfish', sentence: 'A jellyfish in the sea.', image: 'assets/bluey/jellyfish.png', emoji: '🪼', color: '#B070D0' },
  ],
  k: [
    { word: 'Kite', sentence: 'Fly a kite.', image: 'assets/bluey/kite.png', emoji: '🪁', color: '#70B0D0' },
    { word: 'Key', sentence: 'A shiny key.', image: 'assets/bluey/key.png', emoji: '🔑', color: '#D0B040' },
    { word: 'Kitten', sentence: 'A little kitten.', image: 'assets/bluey/kitten.png', emoji: '🐱', color: '#E0A0B0' },
    { word: 'Kiss', sentence: 'Give a kiss.', image: 'assets/bluey/kiss.png', emoji: '💋', color: '#E07090' },        { word: 'Kangaroo', sentence: 'A kangaroo hops.', image: 'assets/bluey/kangaroo.png', emoji: '🦘', color: '#C09860' },
    { word: 'Koala', sentence: 'A koala in a tree.', image: 'assets/bluey/koala.png', emoji: '🐨', color: '#A0A0B0' },

  ],
  l: [
    { word: 'Lion', sentence: 'A lion roars.', image: 'assets/bluey/lion.png', emoji: '🦁', color: '#D0A040' },
    { word: 'Leaf', sentence: 'A green leaf.', image: 'assets/bluey/leaf.png', emoji: '🍃', color: '#60A060' },
    { word: 'Lemon', sentence: 'A sour lemon.', image: 'assets/bluey/lemon.png', emoji: '🍋', color: '#E0D040' },
    { word: 'Love', sentence: 'I love you.', image: 'assets/bluey/love.png', emoji: '❤️', color: '#E07070' },        { word: 'Ladybug', sentence: 'A red ladybug.', image: 'assets/bluey/ladybug.png', emoji: '🐞', color: '#E07070' },

  ],
  m: [
    { word: 'Milk', sentence: 'Drink your milk.', image: 'assets/bluey/milk.png', emoji: '🥛', color: '#D0D0E0' },
    { word: 'Mom', sentence: 'Mom is here.', image: 'assets/bluey/mom.png', emoji: '👩', color: '#D08090' },
    { word: 'Moon', sentence: 'The moon at night.', image: 'assets/bluey/moon.png', emoji: '🌙', color: '#E0D070' },
    { word: 'Monkey', sentence: 'A monkey climbs.', image: 'assets/bluey/monkey.png', emoji: '🐵', color: '#C0956C' },
  ],
  n: [
    { word: 'Nose', sentence: 'We smell with our nose.', image: 'assets/bluey/nose.png', emoji: '👃', color: '#E0B090' },
    { word: 'Nest', sentence: 'A bird\'s nest.', image: 'assets/bluey/nest.png', emoji: '🪺', color: '#B09060' },
    { word: 'Nap', sentence: 'Take a nap.', image: 'assets/bluey/nap.png', emoji: '😴', color: '#90A0C0' },
    { word: 'Nanna', sentence: 'Nanna gives hugs.', image: 'assets/bluey/nanna.png', emoji: '👵', color: '#A09070' },
  ],
  o: [
    { word: 'Orange', sentence: 'An orange fruit.', image: 'assets/bluey/orange.png', emoji: '🍊', color: '#E09030' },
    { word: 'Owl', sentence: 'An owl says hoo.', image: 'assets/bluey/owl.png', emoji: '🦉', color: '#B08860' },
    { word: 'Open', sentence: 'Open the box.', image: 'assets/bluey/open.png', emoji: '📂', color: '#E0A040' },
    { word: 'Ocean', sentence: 'The big blue ocean.', image: 'assets/bluey/ocean.png', emoji: '🌊', color: '#5090B0' },
  ],
  p: [
    { word: 'Pig', sentence: 'A pig says oink.', image: 'assets/bluey/pig.png', emoji: '🐷', color: '#E0A0B0' },
    { word: 'Penguin', sentence: 'A little penguin.', image: 'assets/bluey/penguin.png', emoji: '🐧', color: '#606080' },
    { word: 'Pants', sentence: 'Put on your pants.', image: 'assets/bluey/pants.png', emoji: '👖', color: '#5090C0' },
    { word: 'Pizza', sentence: 'Yummy pizza.', image: 'assets/bluey/pizza.png', emoji: '🍕', color: '#E0A040' },        { word: 'Panda', sentence: 'A black and white panda.', image: 'assets/bluey/panda.png', emoji: '🐼', color: '#707070' },
    { word: 'Peach', sentence: 'A sweet peach.', image: 'assets/bluey/peach.png', emoji: '🍑', color: '#E0A080' },

  ],
  q: [
    { word: 'Queen', sentence: 'A queen has a crown.', image: 'assets/bluey/queen.png', emoji: '👑', color: '#D0B040' },
    { word: 'Quiet', sentence: 'Be quiet, please.', image: 'assets/bluey/queen.png', emoji: '🤫', color: '#A0A0B0' },
    { word: 'Quack', sentence: 'The duck says quack.', image: 'assets/bluey/quack.png', emoji: '🦆', color: '#E0C040' },
  ],
  r: [
    { word: 'Robot', sentence: 'A friendly robot.', image: 'assets/bluey/robot.png', emoji: '🤖', color: '#A0A0B0' },
    { word: 'Rabbit', sentence: 'A rabbit hops.', image: 'assets/bluey/rabbit.png', emoji: '🐰', color: '#E0B0C0' },
    { word: 'Rainbow', sentence: 'A colorful rainbow.', image: 'assets/bluey/rainbow.png', emoji: '🌈', color: '#D08080' },
    { word: 'Rain', sentence: 'The rain falls.', image: 'assets/bluey/rain.png', emoji: '🌧️', color: '#7080C0' },        { word: 'Rocket', sentence: 'A rocket to the moon.', image: 'assets/bluey/rocket.png', emoji: '🚀', color: '#E07050' },

  ],
  s: [
    { word: 'Sun', sentence: 'The sun is bright.', image: 'assets/bluey/sun.png', emoji: '☀️', color: '#E0C040' },
    { word: 'Star', sentence: 'A star in the sky.', image: 'assets/bluey/star.png', emoji: '⭐', color: '#E0D040' },
    { word: 'Socks', sentence: 'Wear your socks.', image: 'assets/bluey/socks.png', emoji: '🧦', color: '#7090C0' },
    { word: 'Shoe', sentence: 'Put on your shoe.', image: 'assets/bluey/shoe.png', emoji: '👟', color: '#E07050' },        { word: 'Sheep', sentence: 'A sheep says baa.', image: 'assets/bluey/sheep.png', emoji: '🐑', color: '#C0C0C0' },
    { word: 'Strawberry', sentence: 'A red strawberry.', image: 'assets/bluey/strawberry.png', emoji: '🍓', color: '#E06060' },
    { word: 'Snail', sentence: 'A slow snail crawls.', image: 'assets/bluey/snail.png', emoji: '🐌', color: '#D0A040' },

  ],
  t: [
    { word: 'Tree', sentence: 'A big green tree.', image: 'assets/bluey/tree.png', emoji: '🌳', color: '#60A060' },
    { word: 'Tiger', sentence: 'A tiger has stripes.', image: 'assets/bluey/tiger.png', emoji: '🐯', color: '#E0A040' },
    { word: 'Tooth', sentence: 'Brush your tooth.', image: 'assets/bluey/tooth.png', emoji: '🦷', color: '#E0E0E0' },
    { word: 'Train', sentence: 'A choo choo train.', image: 'assets/bluey/train.png', emoji: '🚂', color: '#E07050' },        { word: 'Tomato', sentence: 'A red tomato.', image: 'assets/bluey/tomato.png', emoji: '🍅', color: '#E06040' },
    { word: 'Turtle', sentence: 'A slow turtle.', image: 'assets/bluey/turtle.png', emoji: '🐢', color: '#60A080' },

  ],
  u: [
    { word: 'Up', sentence: 'Look up high!', image: 'assets/bluey/up.png', emoji: '⬆️', color: '#70A0D0' },
    { word: 'Uncle', sentence: 'Uncle visits.', image: 'assets/bluey/uncle.png', emoji: '🧑', color: '#B08860' },
    { word: 'Umbrella', sentence: 'An umbrella in the rain.', image: 'assets/bluey/umbrella.png', emoji: '☂️', color: '#7080C0' },
    { word: 'Unicorn', sentence: 'A magical unicorn.', image: 'assets/bluey/unicorn.png', emoji: '🦄', color: '#D070D0' },
  ],
  v: [
    { word: 'Van', sentence: 'A big van.', image: 'assets/bluey/van.png', emoji: '🚐', color: '#70A0D0' },
    { word: 'Veggie', sentence: 'Eat your veggies.', image: 'assets/bluey/veggie.png', emoji: '🥦', color: '#60A060' },
    { word: 'Vest', sentence: 'Wear a vest.', image: 'assets/bluey/vest.png', emoji: '🦺', color: '#E0A040' },
    { word: 'Voice', sentence: 'Sing with your voice.', image: null, emoji: '🗣️', color: '#D08090' },
  ],
  w: [
    { word: 'Water', sentence: 'Drink some water.', image: 'assets/bluey/water.png', emoji: '💧', color: '#5090B0' },
    { word: 'Whale', sentence: 'A big whale.', image: 'assets/bluey/whale.png', emoji: '🐋', color: '#5090B0' },
    { word: 'Wash', sentence: 'Wash your hands.', image: 'assets/bluey/wash.png', emoji: '🧼', color: '#70C0C0' },
    { word: 'Walk', sentence: 'Go for a walk.', image: 'assets/bluey/walk.png', emoji: '🚶', color: '#60A060' },        { word: 'Watermelon', sentence: 'A slice of watermelon.', image: 'assets/bluey/watermelon.png', emoji: '🍉', color: '#60A060' },

  ],
  x: [
    { word: 'X-ray', sentence: 'An x-ray of a bone.', image: 'assets/bluey/x-ray.png', emoji: '🦴', color: '#A0A0B0' },
    { word: 'Xylophone', sentence: 'Play the xylophone.', image: 'assets/bluey/xylophone.png', emoji: '🎵', color: '#C07090' },
  ],
  y: [
    { word: 'Yawn', sentence: 'A big yawn.', image: 'assets/bluey/yawn.png', emoji: '🥱', color: '#E0B090' },
    { word: 'Yellow', sentence: 'The sun is yellow.', image: 'assets/bluey/yawn.png', emoji: '💛', color: '#E0D040' },
    { word: 'Yes', sentence: 'Yes, please!', image: 'assets/bluey/yes.png', emoji: '✅', color: '#60A060' },
    { word: 'Yummy', sentence: 'Yummy food!', image: 'assets/bluey/yummy.png', emoji: '😋', color: '#E0A040' },
  ],
  z: [
    { word: 'Zebra', sentence: 'A zebra has stripes.', image: 'assets/bluey/zebra.png', emoji: '🦓', color: '#707070' },
    { word: 'Zoo', sentence: 'Animals at the zoo.', image: 'assets/bluey/zoo.png', emoji: '🦁', color: '#60A060' },
    { word: 'Zip', sentence: 'Zip up your jacket.', image: 'assets/bluey/zip.png', emoji: '🤐', color: '#7090C0' },
  ]
};


export const DEFAULT_LIBRARY = 'bluey';

export const VOCAB_LIBRARIES = {
  bluey: { name: 'Bluey', cards: BLUEY_CARDS },
  emoji: { name: 'Emoji', cards: LETTER_MAP },
} as const;

export function spokenFor(key: string, card: Pick<FlashCard, 'word'> & { sentence?: string }) {
  const base = key.toUpperCase() + ' ... ' + card.word;
  return card.sentence ? base + '. ' + card.sentence : base;
}
