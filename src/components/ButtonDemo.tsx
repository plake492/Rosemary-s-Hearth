import { useState } from 'react';
import Button from './Button';

// Example icons for demonstration
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default function ButtonDemo() {
  const [loading, setLoading] = useState(false);

  const handleAsyncAction = async () => {
    setLoading(true);
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-8 bg-cream min-h-screen">
      <h1 className="text-3xl font-bold text-brown mb-8">Button Component Demo</h1>

      {/* Button Variants */}
      <section>
        <h2 className="text-xl font-semibold text-brown mb-4">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="border">Border Button</Button>
          <Button variant="error">Error Button</Button>
          <Button variant="error-border">Error Border</Button>
        </div>
      </section>

      {/* Button Sizes */}
      <section>
        <h2 className="text-xl font-semibold text-brown mb-4">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </div>
      </section>

      {/* Buttons with Icons */}
      <section>
        <h2 className="text-xl font-semibold text-brown mb-4">Buttons with Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" leftIcon={<PlusIcon />}>
            Add Item
          </Button>
          <Button variant="error" leftIcon={<TrashIcon />}>
            Delete
          </Button>
          <Button variant="border" rightIcon={<ChevronRightIcon />}>
            Continue
          </Button>
          <Button variant="secondary" leftIcon={<PlusIcon />} rightIcon={<ChevronRightIcon />}>
            Add & Continue
          </Button>
        </div>
      </section>

      {/* Loading States */}
      <section>
        <h2 className="text-xl font-semibold text-brown mb-4">Loading States</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" loading>
            Loading...
          </Button>
          <Button variant="secondary" loading loadingText="Saving...">
            Save Changes
          </Button>
          <Button variant="border" loading={loading} onClick={handleAsyncAction}>
            {loading ? 'Processing...' : 'Start Process'}
          </Button>
        </div>
      </section>

      {/* Disabled States */}
      <section>
        <h2 className="text-xl font-semibold text-brown mb-4">Disabled States</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" disabled>
            Disabled Primary
          </Button>
          <Button variant="secondary" disabled>
            Disabled Secondary
          </Button>
          <Button variant="border" disabled>
            Disabled Border
          </Button>
          <Button variant="error" disabled>
            Disabled Error
          </Button>
          <Button variant="error-border" disabled>
            Disabled Error Border
          </Button>
        </div>
      </section>

      {/* Full Width Buttons */}
      <section>
        <h2 className="text-xl font-semibold text-brown mb-4">Full Width Buttons</h2>
        <div className="space-y-3 max-w-md">
          <Button variant="primary" fullWidth>
            Full Width Primary
          </Button>
          <Button variant="border" fullWidth leftIcon={<PlusIcon />}>
            Full Width with Icon
          </Button>
        </div>
      </section>

      {/* Form Example */}
      <section>
        <h2 className="text-xl font-semibold text-brown mb-4">Form Example</h2>
        <form className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-brown mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-brown rounded focus:outline-none focus:ring-2 focus:ring-orange"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" variant="primary" fullWidth>
              Submit
            </Button>
            <Button type="button" variant="border" fullWidth>
              Cancel
            </Button>
          </div>
        </form>
      </section>

      {/* Custom Styling Example */}
      <section>
        <h2 className="text-xl font-semibold text-brown mb-4">Custom Styling</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" className="rounded-full shadow-lg">
            Rounded Button
          </Button>
          <Button variant="border" className="uppercase tracking-wider font-bold">
            Uppercase Button
          </Button>
        </div>
      </section>
    </div>
  );
}
