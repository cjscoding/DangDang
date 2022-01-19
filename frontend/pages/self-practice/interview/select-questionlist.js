import Link from "next/link";


export default function SelectQuestions() {
  return <div>
    <Link href="/self-practice/interview/check-devices"><a><h1>기본 질문</h1></a></Link>
    <Link href="/self-practice/interview/add-questions"><a><h1>질문 선택</h1></a></Link>
  </div>
}