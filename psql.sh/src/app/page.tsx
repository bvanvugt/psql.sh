import dynamic from 'next/dynamic'

// import Component from "../components/component";



const Component = dynamic(() => import('../components/component'), {
  ssr: false
})

export default function Home() {

  return (
    <Component />
  );
}
