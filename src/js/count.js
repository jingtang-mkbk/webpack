export default function (...args) {
  return args.reduce((p, c)=> p+c);
}