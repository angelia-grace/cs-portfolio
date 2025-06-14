# Name: Angelia-Grace Martin
# OSU Email: marticad@oregonstate.edu
# Course: CS261 - Data Structures
# Assignment: Assignment 6: HashMap Implementations
# Due Date: 3-17-2023
# Description: Implementation of a HashMap data structure that handles collisions via chaining
# singly linked lists.


from a6_include import (DynamicArray, LinkedList,
                        hash_function_1, hash_function_2)


class HashMap:
    def __init__(self,
                 capacity: int = 11,
                 function: callable = hash_function_1) -> None:
        """
        Initialize new HashMap that uses
        separate chaining for collision resolution
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        self._buckets = DynamicArray()

        # capacity must be a prime number
        self._capacity = self._next_prime(capacity)
        for _ in range(self._capacity):
            self._buckets.append(LinkedList())

        self._hash_function = function
        self._size = 0

    def __str__(self) -> str:
        """
        Override string method to provide more readable output
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        out = ''
        for i in range(self._buckets.length()):
            out += str(i) + ': ' + str(self._buckets[i]) + '\n'
        return out

    def _next_prime(self, capacity: int) -> int:
        """
        Increment from given number and the find the closest prime number
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        if capacity % 2 == 0:
            capacity += 1

        while not self._is_prime(capacity):
            capacity += 2

        return capacity

    @staticmethod
    def _is_prime(capacity: int) -> bool:
        """
        Determine if given integer is a prime number and return boolean
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        if capacity == 2 or capacity == 3:
            return True

        if capacity == 1 or capacity % 2 == 0:
            return False

        factor = 3
        while factor ** 2 <= capacity:
            if capacity % factor == 0:
                return False
            factor += 2

        return True

    def get_size(self) -> int:
        """
        Return size of map
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        return self._size

    def get_capacity(self) -> int:
        """
        Return capacity of map
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        return self._capacity

    # ------------------------------------------------------------------ #

    def put(self, key: str, value: object) -> None:
        """
        If key is found in HashMap, updates existing value. Otherwise, adds new key-value pair.
        """
        if self.table_load() >= 1:
            new_capacity = self._capacity * 2
            self.resize_table(self._next_prime(new_capacity))

        # calculate the address
        hash_index = self._hash_function(key)
        hash_index = hash_index % self._capacity

        for node in self._buckets[hash_index]:
            if node.key == key:
                node.value = value
                return

        self._buckets[hash_index].insert(key, value)
        self._size += 1

        return

    def empty_buckets(self) -> int:
        """
        Returns how many empty buckets are in the HashMap.
        """
        empty_buckets_count = 0
        for bucket_index in range(self._buckets.length()):
            bucket = self._buckets[bucket_index]
            if bucket.length() == 0:
                empty_buckets_count += 1
        return empty_buckets_count

    def table_load(self) -> float:
        """
        Returns the load factor (size over capacity) of the table as a float.
        """
        return self._size / self._capacity

    def clear(self) -> None:
        """
        Clears the HashMap, making every bucket empty.
        """
        for bucket_index in range(self._capacity):
            # set each bucket to an empty linked list
            self._buckets.set_at_index(bucket_index, LinkedList())
        self._size = 0
        return

    def resize_table(self, new_capacity: int) -> None:
        """
        Resizes the HashMap according to a passed capacity, then rehashes the keys.
        """
        if new_capacity < 1:
            return

        while self._size / new_capacity > 1:
            new_capacity = new_capacity*2

        if self._is_prime(new_capacity):
            pass
        else:
            new_capacity = self._next_prime(new_capacity)

        # new dynamic array with new capacity (as empty linked lists)
        new_buckets = DynamicArray()
        for bucket_index in range(new_capacity):
            new_buckets.append(LinkedList())
        # copy everything over
        for bucket_index in range(self._buckets.length()):
            for node in self._buckets[bucket_index]:
                hash_index = self._hash_function(node.key)
                hash_index = hash_index % new_capacity
                new_buckets[hash_index].insert(node.key, node.value)
        self._buckets = new_buckets
        self._capacity = new_capacity
        return

    def get(self, key: str):
        """
        Returns value via key lookup.
        """
        hash_index = self._hash_function(key)
        hash_index = hash_index % self._capacity
        remove_bucket = self._buckets[hash_index]
        for node in remove_bucket:
            if node.key == key:
                return node.value
        return

    def contains_key(self, key: str) -> bool:
        """
        Returns True if HashMap contains the passed key, and False otherwise.
        """
        # do the conversion
        # if the key at the address matches the key return true
        # if not, iterate through the bucket
        # return false
        hash_index = self._hash_function(key)
        hash_index = hash_index % self._capacity
        remove_bucket = self._buckets[hash_index]
        for node in remove_bucket:
            if node.key == key:
                return True
        return False

    def remove(self, key: str) -> None:
        """
        Removes key-value if found in HashMap; does nothing otherwise.
        """
        # do the conversion
        # if what's in the bucket matches the key, remove
        # if not, iterate through the bucket
        hash_index = self._hash_function(key)
        hash_index = hash_index % self._capacity
        remove_bucket = self._buckets[hash_index]
        if remove_bucket.remove(key):
            self._size -= 1
        return

    def get_keys_and_values(self) -> DynamicArray:
        """
        Returns all key-value pairs as a nice readable array.
        """
        keys_values_array = DynamicArray()
        for bucket_index in range(self._capacity):
            if self._buckets[bucket_index].length() > 0:
                for node in self._buckets[bucket_index]:
                    keys_values_array.append((node.key, node.value))
        return keys_values_array


def find_mode(da: DynamicArray) -> (DynamicArray, int):
    """
    Finds the mode of an unsorted array in O(N) time by tracking counts with a HashMap.
    """
    # if you'd like to use a hash map,
    # use this instance of your Separate Chaining HashMap
    map = HashMap()
    # for m

    for index in range(da.length()):
        current_key = da[index]
        if map.contains_key(current_key):
            map.put(current_key, map.get(current_key) + 1)
        else:
            map.put(current_key, 1)

    current_modes = DynamicArray()
    current_mode_count = 0
    counts_array = map.get_keys_and_values()

    for node_index in range(counts_array.length()):
        node_key = counts_array[node_index][0]
        node_value = counts_array[node_index][1]
        if node_value == current_mode_count:
            current_modes.append(node_key)
            current_mode_count = node_value
        elif node_value > current_mode_count:
            current_modes = DynamicArray()
            current_modes.append(node_key)
            current_mode_count = node_value

    return (current_modes, current_mode_count)


# ------------------- BASIC TESTING ---------------------------------------- #

if __name__ == "__main__":

    print("\nPDF - put example 1")
    print("-------------------")
    m = HashMap(53, hash_function_1)
    for i in range(150):
        m.put('str' + str(i), i * 100)
        if i % 25 == 24:
            print(m.empty_buckets(), round(m.table_load(), 2), m.get_size(), m.get_capacity())

    print("\nPDF - put example 2")
    print("-------------------")
    m = HashMap(41, hash_function_2)
    for i in range(50):
        m.put('str' + str(i // 3), i * 100)
        if i % 10 == 9:
            print(m.empty_buckets(), round(m.table_load(), 2), m.get_size(), m.get_capacity())

    print("\nPDF - empty_buckets example 1")
    print("-----------------------------")
    m = HashMap(101, hash_function_1)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())
    m.put('key1', 10)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())
    m.put('key2', 20)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())
    m.put('key1', 30)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())
    m.put('key4', 40)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())

    print("\nPDF - empty_buckets example 2")
    print("-----------------------------")
    m = HashMap(53, hash_function_1)
    for i in range(150):
        m.put('key' + str(i), i * 100)
        if i % 30 == 0:
            print(m.empty_buckets(), m.get_size(), m.get_capacity())

    print("\nPDF - table_load example 1")
    print("--------------------------")
    m = HashMap(101, hash_function_1)
    print(round(m.table_load(), 2))
    m.put('key1', 10)
    print(round(m.table_load(), 2))
    m.put('key2', 20)
    print(round(m.table_load(), 2))
    m.put('key1', 30)
    print(round(m.table_load(), 2))

    print("\nPDF - table_load example 2")
    print("--------------------------")
    m = HashMap(53, hash_function_1)
    for i in range(50):
        m.put('key' + str(i), i * 100)
        if i % 10 == 0:
            print(round(m.table_load(), 2), m.get_size(), m.get_capacity())

    print("\nPDF - clear example 1")
    print("---------------------")
    m = HashMap(101, hash_function_1)
    print(m.get_size(), m.get_capacity())
    m.put('key1', 10)
    m.put('key2', 20)
    m.put('key1', 30)
    print(m.get_size(), m.get_capacity())
    m.clear()
    print(m.get_size(), m.get_capacity())

    print("\nPDF - clear example 2")
    print("---------------------")
    m = HashMap(53, hash_function_1)
    print(m.get_size(), m.get_capacity())
    m.put('key1', 10)
    print(m.get_size(), m.get_capacity())
    m.put('key2', 20)
    print(m.get_size(), m.get_capacity())
    m.resize_table(100)
    print(m.get_size(), m.get_capacity())
    m.clear()
    print(m.get_size(), m.get_capacity())

    print("\nPDF - resize example 1")
    print("----------------------")
    m = HashMap(23, hash_function_1)
    m.put('key1', 10)
    print(m.get_size(), m.get_capacity(), m.get('key1'), m.contains_key('key1'))
    m.resize_table(30)
    print(m.get_size(), m.get_capacity(), m.get('key1'), m.contains_key('key1'))

    print("\nPDF - resize example 2")
    print("----------------------")
    m = HashMap(79, hash_function_2)
    keys = [i for i in range(1, 1000, 13)]
    for key in keys:
        m.put(str(key), key * 42)
    print(m.get_size(), m.get_capacity())

    for capacity in range(111, 1000, 117):
        m.resize_table(capacity)

        m.put('some key', 'some value')
        result = m.contains_key('some key')
        m.remove('some key')

        for key in keys:
            # all inserted keys must be present
            result &= m.contains_key(str(key))
            # NOT inserted keys must be absent
            result &= not m.contains_key(str(key + 1))
            pass
        print(capacity, result, m.get_size(), m.get_capacity(), round(m.table_load(), 2))

    print("\nPDF - get example 1")
    print("-------------------")
    m = HashMap(31, hash_function_1)
    print(m.get('key'))
    m.put('key1', 10)
    print(m.get('key1'))

    print("\nPDF - get example 2")
    print("-------------------")
    m = HashMap(151, hash_function_2)
    for i in range(200, 300, 7):
        m.put(str(i), i * 10)
    print(m.get_size(), m.get_capacity())
    for i in range(200, 300, 21):
        print(i, m.get(str(i)), m.get(str(i)) == i * 10)
        print(i + 1, m.get(str(i + 1)), m.get(str(i + 1)) == (i + 1) * 10)

    print("\nPDF - contains_key example 1")
    print("----------------------------")
    m = HashMap(53, hash_function_1)
    print(m.contains_key('key1'))
    m.put('key1', 10)
    m.put('key2', 20)
    m.put('key3', 30)
    print(m.contains_key('key1'))
    print(m.contains_key('key4'))
    print(m.contains_key('key2'))
    print(m.contains_key('key3'))
    m.remove('key3')
    print(m.contains_key('key3'))

    print("\nPDF - contains_key example 2")
    print("----------------------------")
    m = HashMap(79, hash_function_2)
    keys = [i for i in range(1, 1000, 20)]
    for key in keys:
        m.put(str(key), key * 42)
    print(m.get_size(), m.get_capacity())
    result = True
    for key in keys:
        # all inserted keys must be present
        result &= m.contains_key(str(key))
        # NOT inserted keys must be absent
        result &= not m.contains_key(str(key + 1))
        pass
    print(result)

    print("\nPDF - remove example 1")
    print("----------------------")
    m = HashMap(53, hash_function_1)
    print(m.get('key1'))
    m.put('key1', 10)
    print(m.get('key1'))
    m.remove('key1')
    print(m.get('key1'))
    m.remove('key4')

    print("\nPDF - get_keys_and_values example 1")
    print("------------------------")
    m = HashMap(11, hash_function_2)
    for i in range(1, 6):
        m.put(str(i), str(i * 10))
    print(m.get_keys_and_values())

    m.put('20', '200')
    m.remove('1')
    m.resize_table(2)
    print(m.get_keys_and_values())

    print("\nPDF - find_mode example 1")
    print("-----------------------------")
    da = DynamicArray(["apple", "apple", "grape", "melon", "peach"])
    mode, frequency = find_mode(da)
    print(f"Input: {da}\nMode : {mode}, Frequency: {frequency}")

    print("\nPDF - find_mode example 2")
    print("-----------------------------")
    test_cases = (
        ["Arch", "Manjaro", "Manjaro", "Mint", "Mint", "Mint", "Ubuntu", "Ubuntu", "Ubuntu"],
        ["one", "two", "three", "four", "five"],
        ["2", "4", "2", "6", "8", "4", "1", "3", "4", "5", "7", "3", "3", "2"]
    )

    for case in test_cases:
        da = DynamicArray(case)
        mode, frequency = find_mode(da)
        print(f"Input: {da}\nMode : {mode}, Frequency: {frequency}\n")