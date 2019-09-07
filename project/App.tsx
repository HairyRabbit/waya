import Logo from '../logo.svg'
import style from './App.scss'

export default function App() {
  return (
    <div className={style.main}>
      <div className={style.section}>
        <header className={style.header}>Yet another web builder</header>
        <button className={style.button}>Getting Start</button>
      </div>
      <Logo className={style.svg} />
    </div>
  )
}