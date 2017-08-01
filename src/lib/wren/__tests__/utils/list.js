const List = require('../../utils/list')

describe('loopify in groups', () => {
  // it.skip('loopifys single items', () => {
  //   const array = [1,2,3]
  //   const result = [1,2,3,1]
  //   expect(List.loopifyInGroups(1)(array)).toEqual(result)
  // })

  it('loopifys in pairs', () => {
    const array = ['a','b','c']
    const result = [['a','b'],['b','c'],['c','a']]
    expect(List.loopifyInPairs(array)).toEqual(result)
    expect(List.loopifyInGroups(2)(array)).toEqual(result)
  })

  it('loopifys complex arrays in pairs', () => {
    const array = [['a'],'b',[['c']]]
    const result = [[['a'],'b'],['b',[['c']]],[[['c']],['a']]]
    expect(List.loopifyInPairs(array)).toEqual(result)
    expect(List.loopifyInGroups(2)(array)).toEqual(result)
  })

  it('loopifys in groups without offset', () => {
    const array = ['a','b','c','d']
    const result = [['a','b','c'],['b','c','d'],['c','d','a'],['d','a','b']]
    expect(List.loopifyInGroups(3)(array)).toEqual(result)
  })

  it('loopifys in groups with offset', () => {
    const array = ['a','b','c','d','e','f']
    let result = [['a','b','c'],['c','d','e'],['e','f','a']]
    expect(List.loopifyInGroups(3,1)(array)).toEqual(result)

    result = [['a','b','c'],['d','e','f']]
    expect(List.loopifyInGroups(3,2)(array)).toEqual(result)

    result = [['a','b','c'],['e','f','a']]
    expect(List.loopifyInGroups(3,3)(array)).toEqual(result)
  })
})

it('loopifys simple arrays', () => {
  const array = ['a','b','c']
  const result = ['a','b','c','a']
  expect(List.loopify(array)).toEqual(result)
})

it('loopifys complex arrays', () => {
  const array = [['a'],['b'],['c']]
  const result = [['a'],['b'],['c'],['a']]
  expect(List.loopify(array)).toEqual(result)
})

it('wraps into a list', () => {
  const item = 'hello'
  expect(List.wrap('hello')).toEqual(['hello'])
})

it('returns a valid index for out-of-bounds indices with safeIndex', () => {
  const arrayLength = 3
  const i = List.safeIndex(arrayLength)

  expect(i(-4)).toEqual(2)

  expect(i(-3)).toEqual(0)
  expect(i(-2)).toEqual(1)
  expect(i(-1)).toEqual(2)

  expect(i(0)).toEqual(0)
  expect(i(1)).toEqual(1)
  expect(i(2)).toEqual(2)

  expect(i(3)).toEqual(0)
  expect(i(4)).toEqual(1)
  expect(i(5)).toEqual(2)

  expect(i(6)).toEqual(0)
})
