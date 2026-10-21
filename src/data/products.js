const imageModules = import.meta.glob('../assets/produtos/**/*.jpg', {
  eager: true,
  import: 'default',
})

function img(path) {
  return imageModules[`../assets/produtos/${path}`] ?? ''
}

export const categories = [
  {
    id: 'wigs',
    title: 'Wigs',
    description: 'Perucas completas para transformar o seu visual com elegância e naturalidade.',
    products: [
      { id: 'wigs-1', name: 'Wig Valentina', price: 280, description: 'Peruca completa com cabelo leve e natural.', texture: 'liso', length: 'médio', color: 'castanho', image: img('wigs/WigValentina.jpg') },
      { id: 'wigs-2', name: 'Wig Valéria', price: 320, description: 'Peruca com ondas suaves e volume.', texture: 'ondulado', length: 'longo', color: 'preto', image: img('wigs/WigValeria.jpg') },
      { id: 'wigs-3', name: 'Wig Viviane', price: 450, description: 'Peruca premium cacheada.', texture: 'cacheado', length: 'longo', color: 'mel', image: img('wigs/WigViviane.jpg') },
      { id: 'wigs-4', name: 'Wig Vanessa', price: 290, description: 'Peruca curta moderna.', texture: 'liso', length: 'curto', color: 'castanho', image: img('wigs/WigVanessa.jpg') },
      { id: 'wigs-5', name: 'Wig Vitória', price: 380, description: 'Peruca versátil com franja.', texture: 'ondulado', length: 'médio', color: 'preto', image: img('wigs/WigVitoria.jpg') },
      { id: 'wigs-6', name: 'Wig Vera', price: 340, description: 'Peruca elegante para o dia a dia.', texture: 'liso', length: 'longo', color: 'castanho', image: img('wigs/WigVera.jpg') },
    ],
  },
  {
    id: 'lace-front',
    title: 'Lace Front',
    description: 'Perucas e modelos com lace frontal para um acabamento perfeito e discreto.',
    products: [
      { id: 'lace-front-1', name: 'Lace Front Larissa', price: 480, description: 'Lace frontal com cabelo liso.', texture: 'liso', length: 'longo', color: 'preto', image: img('lace-front/LaceFrontLarissa.jpg') },
      { id: 'lace-front-2', name: 'Lace Front Luna', price: 550, description: 'Lace frontal ondulado natural.', texture: 'ondulado', length: 'longo', color: 'castanho', image: img('lace-front/LaceFrontLuna.jpg') },
      { id: 'lace-front-3', name: 'Lace Front Laura', price: 620, description: 'Lace frontal cacheado premium.', texture: 'cacheado', length: 'longo', color: 'mel', image: img('lace-front/LaceFrontLaura.jpg') },
      { id: 'lace-front-4', name: 'Lace Front Lívia', price: 500, description: 'Lace frontal médio elegante.', texture: 'liso', length: 'médio', color: 'preto', image: img('lace-front/LaceFrontLivia.jpg') },
      { id: 'lace-front-5', name: 'Lace Front Luana', price: 700, description: 'Lace frontal deep wave luxuoso.', texture: 'ondulado', length: 'longo', color: 'castanho', image: img('lace-front/LaceFrontLuana.jpg') },
      { id: 'lace-front-6', name: 'Lace Front Lorena', price: 750, description: 'Lace frontal platinado exclusivo.', texture: 'liso', length: 'longo', color: 'platinum', image: img('lace-front/LaceFrontLorena.jpg') },
    ],
  },
  {
    id: 'cabelo-humano',
    title: 'Cabelo',
    description: 'Cabelo humano e extensões para volume e comprimento.',
    products: [
      { id: 'cabelo-humano-1', name: 'Bundle Elisa 18"', price: 890, description: 'Bundle liso de cabelo humano.', texture: 'liso', length: '18"', color: 'preto', image: img('cabelo-humano/CabeloHumanoElisa.jpg') },
      { id: 'cabelo-humano-2', name: 'Bundle Ester 20"', price: 990, description: 'Bundle cacheado natural.', texture: 'cacheado', length: '20"', color: 'castanho', image: img('cabelo-humano/CabeloHumanoEster.jpg') },
      { id: 'cabelo-humano-3', name: 'Bundle Débora 22"', price: 1090, description: 'Bundle ondulado premium.', texture: 'ondulado', length: '22"', color: 'preto', image: img('cabelo-humano/CabeloHumanoDebora.jpg') },
      { id: 'cabelo-humano-4', name: 'Bundle Daniela 24"', price: 1190, description: 'Bundle longo e volumoso.', texture: 'liso', length: '24"', color: 'mel', image: img('cabelo-humano/CabeloHumanoDaniela.jpg') },
      { id: 'cabelo-humano-5', name: 'Bundle Camila 20"', price: 1050, description: 'Bundle médio elegante.', texture: 'cacheado', length: '20"', color: 'castanho', image: img('cabelo-humano/CabeloHumanoCamila.jpg') },
      { id: 'cabelo-humano-6', name: 'Bundle Beatriz 26"', price: 1490, description: 'Bundle extra longo luxuoso.', texture: 'ondulado', length: '26"', color: 'preto', image: img('cabelo-humano/CabeloHumanoBeatriz.jpg') },
    ],
  },
  {
    id: 'rabos-de-cavalo',
    title: 'Rabos de Cavalo',
    description: 'Extensões para ponytail que adicionam comprimento e volume instantaneamente.',
    products: [
      { id: 'rabos-de-cavalo-1', name: 'Rabo Flávia 20"', price: 180, description: 'Rabo liso para ponytail.', texture: 'liso', length: '20"', color: 'preto', image: img('rabos-de-cavalo/RaboDeCavaloFlavia.jpg') },
      { id: 'rabos-de-cavalo-2', name: 'Rabo Fernanda 22"', price: 220, description: 'Rabo cacheado volumoso.', texture: 'cacheado', length: '22"', color: 'castanho', image: img('rabos-de-cavalo/RaboDeCavaloFernanda.jpg') },
      { id: 'rabos-de-cavalo-3', name: 'Rabo Fabiana 18"', price: 190, description: 'Rabo ondulado elegante.', texture: 'ondulado', length: '18"', color: 'preto', image: img('rabos-de-cavalo/RabodeCavaloFabiana.jpg') },
      { id: 'rabos-de-cavalo-4', name: 'Rabo Francine', price: 280, description: 'Rabo longo premium.', texture: 'liso', length: '24"', color: 'mel', image: img('rabos-de-cavalo/RaboDeCavaloFrancine.jpg') },
      { id: 'rabos-de-cavalo-5', name: 'Rabo Filomena', price: 250, description: 'Rabo médio versátil.', texture: 'cacheado', length: '20"', color: 'castanho', image: img('rabos-de-cavalo/RaboDeCavaloFilomena.jpg') },
      { id: 'rabos-de-cavalo-6', name: 'Rabo Fabrícia', price: 320, description: 'Rabo extra longo luxuoso.', texture: 'ondulado', length: '26"', color: 'preto', image: img('rabos-de-cavalo/RaboDeCavaloFabricia.jpg') },
    ],
  },
  {
    id: 'acessorios',
    title: 'Acessórios',
    description: 'Colas para lace, pentes para baby hair, escovinhas e outros acessórios.',
    products: [
      { id: 'acessorios-1', name: 'Cola para Lace Forte', price: 45, description: 'Cola de alta fixação para lace frontal.', type: 'Cola', purpose: 'Fixação de lace', image: img('acessorios/ColaForte.jpg') },
      { id: 'acessorios-2', name: 'Cola para Lace Suave', price: 39, description: 'Cola suave para peles sensíveis.', type: 'Cola', purpose: 'Fixação suave', image: img('acessorios/ColaSuave.jpg') },
      { id: 'acessorios-3', name: 'Pente Baby Hair', price: 25, description: 'Pente fino para modelar baby hair.', type: 'Pente', purpose: 'Acabamento', image: img('acessorios/PenteBabyHair.jpg') },
      { id: 'acessorios-4', name: 'Escovinha Fina', price: 19, description: 'Escova fina para detalhes.', type: 'Escova', purpose: 'Acabamento', image: img('acessorios/EscovaFina.jpg') },
      { id: 'acessorios-5', name: 'Kit Fixação Completo', price: 120, description: 'Kit com cola, pente e escova.', type: 'Kit', purpose: 'Fixação completa', image: img('acessorios/KitFixacao.jpg') },
      { id: 'acessorios-6', name: 'Pente Premium', price: 35, description: 'Pente duplo para penteados.', type: 'Pente', purpose: 'Penteado', image: img('acessorios/PentePremium.jpg') },
    ],
  },
]

const featuredSelection = [
  { id: 'lace-front-3', badge: 'Destaque' },
  { id: 'wigs-2', badge: 'Destaque' },
  { id: 'cabelo-humano-4', badge: 'Mais escolhido' },
]

export const featuredProducts = featuredSelection
  .map(({ id, badge }) => {
    const category = categories.find((cat) => cat.products.some((p) => p.id === id))
    const product = category?.products.find((p) => p.id === id)
    if (!category || !product) return null
    return { ...product, categoryTitle: category.title, badge }
  })
  .filter(Boolean)
