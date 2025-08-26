import IngredientsItem from './IngredientsItem';

const dummyData = [
  { id: 1, name: 'Ingredient 1', quantity: '100g' },
  { id: 2, name: 'Ingredient 2', quantity: '200g' },
  { id: 3, name: 'Ingredient 3', quantity: '300g' },
];

export default function IngredientsTable() {
  return (
    <div>
      <ul>
        {dummyData.map((ingredient) => (
          <IngredientsItem item={ingredient} />
        ))}
      </ul>
    </div>
  );
}
