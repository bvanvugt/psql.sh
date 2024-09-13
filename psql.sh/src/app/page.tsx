import dynamic from 'next/dynamic'

const Component = dynamic(() => import('../components/component'), {
  ssr: false
})

export default function Home() {

  return (
    <Component />
  );
}
