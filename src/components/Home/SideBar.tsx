export default function SideBar() {
  return (
    <section className="flex flex-col items-center">
      <img src="/images/logo.svg" width={280} height={280} />
      <p className="h3 px-4 text-center uppercase pb-6">
        Every purchase helps us donate bread back to the community
      </p>
      <p className="h5 text-center mb-4 text-balance p-4 rounded-lg bg-light-orange">
        Text <span className="uppercase font-bold">“bread”</span> to{' '}
        <span className="font-bold text-nowrap">123-456-7890</span> to keep in
        touch with us!
      </p>
    </section>
  );
}
