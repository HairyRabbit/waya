import { ReactChild, ButtonHTMLAttributes } from 'react'
import * as style from './style.scss'
import React = require('react')


export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactChild
}

export function Button({ 
  type = 'button',
  ...props
}: Partial<Readonly<ButtonProps>> = {}) {
  return <button className={style.main} type={type} {...props} />
}