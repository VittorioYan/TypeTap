export const testStoredMessages = [
    {
        "type": "human",
        "data": {
            "content": "Checkout merge requests assigned to me",
            "additional_kwargs": {},
            "response_metadata": {}
        }
    },
    {
        "type": "ai",
        "data": {
            "content": "",
            "additional_kwargs": {
                "tool_calls": [
                    {
                        "index": 0,
                        "id": "call_bZgztCIepGAYhM30eNZ0ICXC",
                        "type": "function",
                        "function": {
                            "name": "clickTool",
                            "arguments": "{\"elementID\":\"I8az\",\"purpose\":\"Access the merge requests assigned to me.\"}"
                        }
                    }
                ]
            },
            "response_metadata": {
                "estimatedTokenUsage": {
                    "promptTokens": 10769,
                    "completionTokens": 0,
                    "totalTokens": 10769
                },
                "prompt": 0,
                "completion": 0,
                "finish_reason": "tool_calls",
                "system_fingerprint": "fp_0705bf87c0",
                "usage": {
                    "prompt_tokens": 10908,
                    "completion_tokens": 28,
                    "total_tokens": 10936,
                    "prompt_tokens_details": {
                        "cached_tokens": 0,
                        "audio_tokens": 0
                    },
                    "completion_tokens_details": {
                        "reasoning_tokens": 0,
                        "audio_tokens": 0,
                        "accepted_prediction_tokens": 0,
                        "rejected_prediction_tokens": 0
                    }
                }
            },
            "tool_call_chunks": [
                {
                    "name": "clickTool",
                    "args": "{\"elementID\":\"I8az\",\"purpose\":\"Access the merge requests assigned to me.\"}",
                    "id": "call_bZgztCIepGAYhM30eNZ0ICXC",
                    "index": 0,
                    "type": "tool_call_chunk"
                }
            ],
            "id": "chatcmpl-AaHDhefJqaurwK5SBJWpmAG6QrEzI",
            "tool_calls": [
                {
                    "name": "clickTool",
                    "args": {
                        "elementID": "I8az",
                        "purpose": "Access the merge requests assigned to me."
                    },
                    "id": "call_bZgztCIepGAYhM30eNZ0ICXC",
                    "type": "tool_call"
                }
            ],
            "invalid_tool_calls": []
        }
    },
    {
        "type": "tool",
        "data": {
            "content": "{\n  \"status\": \"success\",\n  \"message\": \"点击成功\"\n}",
            "tool_call_id": "call_bZgztCIepGAYhM30eNZ0ICXC",
            "name": "clickTool",
            "additional_kwargs": {},
            "response_metadata": {}
        }
    },
    {
        "type": "ai",
        "data": {
            "content": "",
            "additional_kwargs": {
                "tool_calls": [
                    {
                        "index": 0,
                        "id": "call_0NNqgwiMretYuEEYs2o7Xpt0",
                        "type": "function",
                        "function": {
                            "name": "clickTool",
                            "arguments": "{\"elementID\":\"srXM\",\"purpose\":\"View the merge requests assigned to me.\"}"
                        }
                    }
                ]
            },
            "response_metadata": {
                "estimatedTokenUsage": {
                    "promptTokens": 10849,
                    "completionTokens": 0,
                    "totalTokens": 10849
                },
                "prompt": 0,
                "completion": 0,
                "finish_reason": "tool_calls",
                "system_fingerprint": "fp_0705bf87c0",
                "usage": {
                    "prompt_tokens": 11013,
                    "completion_tokens": 27,
                    "total_tokens": 11040,
                    "prompt_tokens_details": {
                        "cached_tokens": 0,
                        "audio_tokens": 0
                    },
                    "completion_tokens_details": {
                        "reasoning_tokens": 0,
                        "audio_tokens": 0,
                        "accepted_prediction_tokens": 0,
                        "rejected_prediction_tokens": 0
                    }
                }
            },
            "tool_call_chunks": [
                {
                    "name": "clickTool",
                    "args": "{\"elementID\":\"srXM\",\"purpose\":\"View the merge requests assigned to me.\"}",
                    "id": "call_0NNqgwiMretYuEEYs2o7Xpt0",
                    "index": 0,
                    "type": "tool_call_chunk"
                }
            ],
            "id": "chatcmpl-AaHDmzao5qeYYpA4WykR2f2dbJ7Zj",
            "tool_calls": [
                {
                    "name": "clickTool",
                    "args": {
                        "elementID": "srXM",
                        "purpose": "View the merge requests assigned to me."
                    },
                    "id": "call_0NNqgwiMretYuEEYs2o7Xpt0",
                    "type": "tool_call"
                }
            ],
            "invalid_tool_calls": []
        }
    },
    {
        "type": "tool",
        "data": {
            "content": "{\n  \"status\": \"success\",\n  \"message\": \"页面跳转\"\n}",
            "tool_call_id": "call_0NNqgwiMretYuEEYs2o7Xpt0",
            "name": "clickTool",
            "additional_kwargs": {},
            "response_metadata": {}
        }
    },
    {
        "type": "ai",
        "data": {
            "content": "",
            "additional_kwargs": {
                "tool_calls": [
                    {
                        "index": 0,
                        "id": "call_6HWJBiypwyYiWXqD6MfNZ2ME",
                        "type": "function",
                        "function": {
                            "name": "clickTool",
                            "arguments": "{\"elementID\":\"Asxg\",\"purpose\":\"Filter merge requests assigned to me.\"}"
                        }
                    }
                ]
            },
            "response_metadata": {
                "estimatedTokenUsage": {
                    "promptTokens": 3962,
                    "completionTokens": 0,
                    "totalTokens": 3962
                },
                "prompt": 0,
                "completion": 0,
                "finish_reason": "tool_calls",
                "system_fingerprint": "fp_0705bf87c0",
                "usage": {
                    "prompt_tokens": 4150,
                    "completion_tokens": 27,
                    "total_tokens": 4177,
                    "prompt_tokens_details": {
                        "cached_tokens": 0,
                        "audio_tokens": 0
                    },
                    "completion_tokens_details": {
                        "reasoning_tokens": 0,
                        "audio_tokens": 0,
                        "accepted_prediction_tokens": 0,
                        "rejected_prediction_tokens": 0
                    }
                }
            },
            "tool_call_chunks": [
                {
                    "name": "clickTool",
                    "args": "{\"elementID\":\"Asxg\",\"purpose\":\"Filter merge requests assigned to me.\"}",
                    "id": "call_6HWJBiypwyYiWXqD6MfNZ2ME",
                    "index": 0,
                    "type": "tool_call_chunk"
                }
            ],
            "id": "chatcmpl-AaHDruvIJzJ0xNHwk2iDvykwPxxdK",
            "tool_calls": [
                {
                    "name": "clickTool",
                    "args": {
                        "elementID": "Asxg",
                        "purpose": "Filter merge requests assigned to me."
                    },
                    "id": "call_6HWJBiypwyYiWXqD6MfNZ2ME",
                    "type": "tool_call"
                }
            ],
            "invalid_tool_calls": []
        }
    },
    {
        "type": "tool",
        "data": {
            "content": "{\n  \"status\": \"success\",\n  \"message\": \"点击成功\"\n}",
            "tool_call_id": "call_6HWJBiypwyYiWXqD6MfNZ2ME",
            "name": "clickTool",
            "additional_kwargs": {},
            "response_metadata": {}
        }
    },
    {
        "type": "ai",
        "data": {
            "content": "",
            "additional_kwargs": {
                "tool_calls": [
                    {
                        "index": 0,
                        "id": "call_gMK9dmO8ZnPD0qQfLn6yL0A0",
                        "type": "function",
                        "function": {
                            "name": "clickTool",
                            "arguments": "{\"elementID\":\"80cE\",\"purpose\":\"View merge requests assigned to me.\"}"
                        }
                    }
                ]
            },
            "response_metadata": {
                "estimatedTokenUsage": {
                    "promptTokens": 4044,
                    "completionTokens": 0,
                    "totalTokens": 4044
                },
                "prompt": 0,
                "completion": 0,
                "finish_reason": "tool_calls",
                "system_fingerprint": "fp_0705bf87c0",
                "usage": {
                    "prompt_tokens": 4256,
                    "completion_tokens": 27,
                    "total_tokens": 4283,
                    "prompt_tokens_details": {
                        "cached_tokens": 0,
                        "audio_tokens": 0
                    },
                    "completion_tokens_details": {
                        "reasoning_tokens": 0,
                        "audio_tokens": 0,
                        "accepted_prediction_tokens": 0,
                        "rejected_prediction_tokens": 0
                    }
                }
            },
            "tool_call_chunks": [
                {
                    "name": "clickTool",
                    "args": "{\"elementID\":\"80cE\",\"purpose\":\"View merge requests assigned to me.\"}",
                    "id": "call_gMK9dmO8ZnPD0qQfLn6yL0A0",
                    "index": 0,
                    "type": "tool_call_chunk"
                }
            ],
            "id": "chatcmpl-AaHDv9ADmauL4eWYEkrl36yrZ74GG",
            "tool_calls": [
                {
                    "name": "clickTool",
                    "args": {
                        "elementID": "80cE",
                        "purpose": "View merge requests assigned to me."
                    },
                    "id": "call_gMK9dmO8ZnPD0qQfLn6yL0A0",
                    "type": "tool_call"
                }
            ],
            "invalid_tool_calls": []
        }
    },
    {
        "type": "tool",
        "data": {
            "content": "{\n  \"status\": \"success\",\n  \"message\": \"点击成功\"\n}",
            "tool_call_id": "call_gMK9dmO8ZnPD0qQfLn6yL0A0",
            "name": "clickTool",
            "additional_kwargs": {},
            "response_metadata": {}
        }
    },
    {
        "type": "ai",
        "data": {
            "content": "I have successfully accessed the merge requests assigned to you. You can now review them on the page. If you need any further assistance, feel free to ask!",
            "additional_kwargs": {},
            "response_metadata": {
                "estimatedTokenUsage": {
                    "promptTokens": 4017,
                    "completionTokens": 32,
                    "totalTokens": 4049
                },
                "prompt": 0,
                "completion": 0,
                "finish_reason": "stop",
                "system_fingerprint": "fp_0705bf87c0",
                "usage": {
                    "prompt_tokens": 4253,
                    "completion_tokens": 33,
                    "total_tokens": 4286,
                    "prompt_tokens_details": {
                        "cached_tokens": 0,
                        "audio_tokens": 0
                    },
                    "completion_tokens_details": {
                        "reasoning_tokens": 0,
                        "audio_tokens": 0,
                        "accepted_prediction_tokens": 0,
                        "rejected_prediction_tokens": 0
                    }
                }
            },
            "tool_call_chunks": [],
            "id": "chatcmpl-AaHDzdipDu28fbRZCOSR9ixRUjMID",
            "tool_calls": [],
            "invalid_tool_calls": []
        }
    },
    {
        "type": "human",
        "data": {
            "content": "Tell me the full names of the repositories where I made contributions and they got more than 100 stars?",
            "additional_kwargs": {},
            "response_metadata": {}
        }
    },
    {
        "type": "ai",
        "data": {
            "content": "",
            "additional_kwargs": {
                "tool_calls": [
                    {
                        "index": 0,
                        "id": "call_1yl5mLofujitD61r75ZUekl0",
                        "type": "function",
                        "function": {
                            "name": "clickTool",
                            "arguments": "{\"elementID\":\"fbXB\",\"purpose\":\"Access the repositories where I made contributions.\"}"
                        }
                    }
                ]
            },
            "response_metadata": {
                "estimatedTokenUsage": {
                    "promptTokens": 4078,
                    "completionTokens": 0,
                    "totalTokens": 4078
                },
                "prompt": 0,
                "completion": 0,
                "finish_reason": "tool_calls",
                "system_fingerprint": "fp_0705bf87c0",
                "usage": {
                    "prompt_tokens": 4314,
                    "completion_tokens": 27,
                    "total_tokens": 4341,
                    "prompt_tokens_details": {
                        "cached_tokens": 4224,
                        "audio_tokens": 0
                    },
                    "completion_tokens_details": {
                        "reasoning_tokens": 0,
                        "audio_tokens": 0,
                        "accepted_prediction_tokens": 0,
                        "rejected_prediction_tokens": 0
                    }
                }
            },
            "tool_call_chunks": [
                {
                    "name": "clickTool",
                    "args": "{\"elementID\":\"fbXB\",\"purpose\":\"Access the repositories where I made contributions.\"}",
                    "id": "call_1yl5mLofujitD61r75ZUekl0",
                    "index": 0,
                    "type": "tool_call_chunk"
                }
            ],
            "id": "chatcmpl-AaHIH9CCCaPUtAG67p69vvyVyCHWF",
            "usage_metadata": {
                "input_tokens": 4314,
                "output_tokens": 27,
                "total_tokens": 4341,
                "input_token_details": {
                    "audio": 0,
                    "cache_read": 4224
                },
                "output_token_details": {
                    "audio": 0,
                    "reasoning": 0
                }
            },
            "tool_calls": [
                {
                    "name": "clickTool",
                    "args": {
                        "elementID": "fbXB",
                        "purpose": "Access the repositories where I made contributions."
                    },
                    "id": "call_1yl5mLofujitD61r75ZUekl0",
                    "type": "tool_call"
                }
            ],
            "invalid_tool_calls": []
        }
    },
    {
        "type": "tool",
        "data": {
            "content": "{\n  \"status\": \"success\",\n  \"message\": \"页面跳转\"\n}",
            "tool_call_id": "call_1yl5mLofujitD61r75ZUekl0",
            "name": "clickTool",
            "additional_kwargs": {},
            "response_metadata": {}
        }
    },
    {
        "type": "ai",
        "data": {
            "content": "",
            "additional_kwargs": {
                "tool_calls": [
                    {
                        "index": 0,
                        "id": "call_u6CF6XlZT8OXLbb1QRNTNGzk",
                        "type": "function",
                        "function": {
                            "name": "clickTool",
                            "arguments": "{\"elementID\":\"s3gD\",\"purpose\":\"Filter repositories based on contributions.\"}"
                        }
                    }
                ]
            },
            "response_metadata": {
                "estimatedTokenUsage": {
                    "promptTokens": 7157,
                    "completionTokens": 0,
                    "totalTokens": 7157
                },
                "prompt": 0,
                "completion": 0,
                "finish_reason": "tool_calls",
                "system_fingerprint": "fp_0705bf87c0",
                "usage": {
                    "prompt_tokens": 7417,
                    "completion_tokens": 27,
                    "total_tokens": 7444,
                    "prompt_tokens_details": {
                        "cached_tokens": 0,
                        "audio_tokens": 0
                    },
                    "completion_tokens_details": {
                        "reasoning_tokens": 0,
                        "audio_tokens": 0,
                        "accepted_prediction_tokens": 0,
                        "rejected_prediction_tokens": 0
                    }
                }
            },
            "tool_call_chunks": [
                {
                    "name": "clickTool",
                    "args": "{\"elementID\":\"s3gD\",\"purpose\":\"Filter repositories based on contributions.\"}",
                    "id": "call_u6CF6XlZT8OXLbb1QRNTNGzk",
                    "index": 0,
                    "type": "tool_call_chunk"
                }
            ],
            "id": "chatcmpl-AaHIPdlMjl7mFUJ93bIlVEOowzLpZ",
            "usage_metadata": {
                "input_tokens": 7417,
                "output_tokens": 27,
                "total_tokens": 7444,
                "input_token_details": {
                    "audio": 0,
                    "cache_read": 0
                },
                "output_token_details": {
                    "audio": 0,
                    "reasoning": 0
                }
            },
            "tool_calls": [
                {
                    "name": "clickTool",
                    "args": {
                        "elementID": "s3gD",
                        "purpose": "Filter repositories based on contributions."
                    },
                    "id": "call_u6CF6XlZT8OXLbb1QRNTNGzk",
                    "type": "tool_call"
                }
            ],
            "invalid_tool_calls": []
        }
    },
    {
        "type": "tool",
        "data": {
            "content": "{\n  \"status\": \"fail\",\n  \"message\": \"Cannot read properties of null (reading 'contentDocument')\"\n}",
            "tool_call_id": "call_u6CF6XlZT8OXLbb1QRNTNGzk",
            "name": "clickTool",
            "additional_kwargs": {},
            "response_metadata": {}
        }
    },
    {
        "type": "ai",
        "data": {
            "content": "",
            "additional_kwargs": {
                "tool_calls": [
                    {
                        "index": 0,
                        "id": "call_JyTM8KbBTpxDwPrkaSUHrR7D",
                        "type": "function",
                        "function": {
                            "name": "clickTool",
                            "arguments": "{\"elementID\":\"O8WM\",\"purpose\":\"Access the issues page to find repositories.\"}"
                        }
                    }
                ]
            },
            "response_metadata": {
                "estimatedTokenUsage": {
                    "promptTokens": 7194,
                    "completionTokens": 0,
                    "totalTokens": 7194
                },
                "prompt": 0,
                "completion": 0,
                "finish_reason": "tool_calls",
                "system_fingerprint": "fp_0705bf87c0",
                "usage": {
                    "prompt_tokens": 7478,
                    "completion_tokens": 28,
                    "total_tokens": 7506,
                    "prompt_tokens_details": {
                        "cached_tokens": 7296,
                        "audio_tokens": 0
                    },
                    "completion_tokens_details": {
                        "reasoning_tokens": 0,
                        "audio_tokens": 0,
                        "accepted_prediction_tokens": 0,
                        "rejected_prediction_tokens": 0
                    }
                }
            },
            "tool_call_chunks": [
                {
                    "name": "clickTool",
                    "args": "{\"elementID\":\"O8WM\",\"purpose\":\"Access the issues page to find repositories.\"}",
                    "id": "call_JyTM8KbBTpxDwPrkaSUHrR7D",
                    "index": 0,
                    "type": "tool_call_chunk"
                }
            ],
            "id": "chatcmpl-AaHIRTSePlGVX7uYsMfPjIyH7JKZW",
            "usage_metadata": {
                "input_tokens": 7478,
                "output_tokens": 28,
                "total_tokens": 7506,
                "input_token_details": {
                    "audio": 0,
                    "cache_read": 7296
                },
                "output_token_details": {
                    "audio": 0,
                    "reasoning": 0
                }
            },
            "tool_calls": [
                {
                    "name": "clickTool",
                    "args": {
                        "elementID": "O8WM",
                        "purpose": "Access the issues page to find repositories."
                    },
                    "id": "call_JyTM8KbBTpxDwPrkaSUHrR7D",
                    "type": "tool_call"
                }
            ],
            "invalid_tool_calls": []
        }
    },
    {
        "type": "tool",
        "data": {
            "content": "{\n  \"status\": \"success\",\n  \"message\": \"点击成功\"\n}",
            "tool_call_id": "call_JyTM8KbBTpxDwPrkaSUHrR7D",
            "name": "clickTool",
            "additional_kwargs": {},
            "response_metadata": {}
        }
    },
    {
        "type": "ai",
        "data": {
            "content": "",
            "additional_kwargs": {
                "tool_calls": [
                    {
                        "index": 0,
                        "id": "call_95SaTqcbOg3C144NpIWZJgJ1",
                        "type": "function",
                        "function": {
                            "name": "clickTool",
                            "arguments": "{\"elementID\":\"GoWr\",\"purpose\":\"Access the merge requests to find contributions.\"}"
                        }
                    }
                ]
            },
            "response_metadata": {
                "estimatedTokenUsage": {
                    "promptTokens": 7223,
                    "completionTokens": 0,
                    "totalTokens": 7223
                },
                "prompt": 0,
                "completion": 0,
                "finish_reason": "tool_calls",
                "system_fingerprint": "fp_0705bf87c0",
                "usage": {
                    "prompt_tokens": 7532,
                    "completion_tokens": 27,
                    "total_tokens": 7559,
                    "prompt_tokens_details": {
                        "cached_tokens": 0,
                        "audio_tokens": 0
                    },
                    "completion_tokens_details": {
                        "reasoning_tokens": 0,
                        "audio_tokens": 0,
                        "accepted_prediction_tokens": 0,
                        "rejected_prediction_tokens": 0
                    }
                }
            },
            "tool_call_chunks": [
                {
                    "name": "clickTool",
                    "args": "{\"elementID\":\"GoWr\",\"purpose\":\"Access the merge requests to find contributions.\"}",
                    "id": "call_95SaTqcbOg3C144NpIWZJgJ1",
                    "index": 0,
                    "type": "tool_call_chunk"
                }
            ],
            "id": "chatcmpl-AaHIbyneYD4G9pd2lgR7gXh5O7nZT",
            "usage_metadata": {
                "input_tokens": 7532,
                "output_tokens": 27,
                "total_tokens": 7559,
                "input_token_details": {
                    "audio": 0,
                    "cache_read": 0
                },
                "output_token_details": {
                    "audio": 0,
                    "reasoning": 0
                }
            },
            "tool_calls": [
                {
                    "name": "clickTool",
                    "args": {
                        "elementID": "GoWr",
                        "purpose": "Access the merge requests to find contributions."
                    },
                    "id": "call_95SaTqcbOg3C144NpIWZJgJ1",
                    "type": "tool_call"
                }
            ],
            "invalid_tool_calls": []
        }
    },
    {
        "type": "tool",
        "data": {
            "content": "{\n  \"status\": \"success\",\n  \"message\": \"点击成功\"\n}",
            "tool_call_id": "call_95SaTqcbOg3C144NpIWZJgJ1",
            "name": "clickTool",
            "additional_kwargs": {},
            "response_metadata": {}
        }
    },
    {
        "type": "ai",
        "data": {
            "content": "",
            "additional_kwargs": {
                "tool_calls": [
                    {
                        "index": 0,
                        "id": "call_lKBFmh6tC31jyUcTvy2yHgn2",
                        "type": "function",
                        "function": {
                            "name": "clickTool",
                            "arguments": "{\"elementID\":\"xuHc\",\"purpose\":\"Access the projects to find repositories.\"}"
                        }
                    }
                ]
            },
            "response_metadata": {
                "estimatedTokenUsage": {
                    "promptTokens": 7305,
                    "completionTokens": 0,
                    "totalTokens": 7305
                },
                "prompt": 0,
                "completion": 0,
                "finish_reason": "tool_calls",
                "system_fingerprint": "fp_0705bf87c0",
                "usage": {
                    "prompt_tokens": 7638,
                    "completion_tokens": 27,
                    "total_tokens": 7665,
                    "prompt_tokens_details": {
                        "cached_tokens": 0,
                        "audio_tokens": 0
                    },
                    "completion_tokens_details": {
                        "reasoning_tokens": 0,
                        "audio_tokens": 0,
                        "accepted_prediction_tokens": 0,
                        "rejected_prediction_tokens": 0
                    }
                }
            },
            "tool_call_chunks": [
                {
                    "name": "clickTool",
                    "args": "{\"elementID\":\"xuHc\",\"purpose\":\"Access the projects to find repositories.\"}",
                    "id": "call_lKBFmh6tC31jyUcTvy2yHgn2",
                    "index": 0,
                    "type": "tool_call_chunk"
                }
            ],
            "id": "chatcmpl-AaHIk4dupUs5bGmgpHfPCDMhD40uK",
            "usage_metadata": {
                "input_tokens": 7638,
                "output_tokens": 27,
                "total_tokens": 7665,
                "input_token_details": {
                    "audio": 0,
                    "cache_read": 0
                },
                "output_token_details": {
                    "audio": 0,
                    "reasoning": 0
                }
            },
            "tool_calls": [
                {
                    "name": "clickTool",
                    "args": {
                        "elementID": "xuHc",
                        "purpose": "Access the projects to find repositories."
                    },
                    "id": "call_lKBFmh6tC31jyUcTvy2yHgn2",
                    "type": "tool_call"
                }
            ],
            "invalid_tool_calls": []
        }
    },
    {
        "type": "tool",
        "data": {
            "content": "{\n  \"status\": \"success\",\n  \"message\": \"页面跳转\"\n}",
            "tool_call_id": "call_lKBFmh6tC31jyUcTvy2yHgn2",
            "name": "clickTool",
            "additional_kwargs": {},
            "response_metadata": {}
        }
    },
    {
        "type": "ai",
        "data": {
            "content": "",
            "additional_kwargs": {
                "tool_calls": [
                    {
                        "index": 0,
                        "id": "call_G7Y2szh9hcT5cRXWLwR3KKxF",
                        "type": "function",
                        "function": {
                            "name": "clickTool",
                            "arguments": "{\"elementID\":\"zRwx\",\"purpose\":\"View the repository details.\"}"
                        }
                    }
                ]
            },
            "response_metadata": {
                "estimatedTokenUsage": {
                    "promptTokens": 4219,
                    "completionTokens": 0,
                    "totalTokens": 4219
                },
                "prompt": 0,
                "completion": 0,
                "finish_reason": "tool_calls",
                "system_fingerprint": "fp_0705bf87c0",
                "usage": {
                    "prompt_tokens": 4576,
                    "completion_tokens": 25,
                    "total_tokens": 4601,
                    "prompt_tokens_details": {
                        "cached_tokens": 0,
                        "audio_tokens": 0
                    },
                    "completion_tokens_details": {
                        "reasoning_tokens": 0,
                        "audio_tokens": 0,
                        "accepted_prediction_tokens": 0,
                        "rejected_prediction_tokens": 0
                    }
                }
            },
            "tool_call_chunks": [
                {
                    "name": "clickTool",
                    "args": "{\"elementID\":\"zRwx\",\"purpose\":\"View the repository details.\"}",
                    "id": "call_G7Y2szh9hcT5cRXWLwR3KKxF",
                    "index": 0,
                    "type": "tool_call_chunk"
                }
            ],
            "id": "chatcmpl-AaHIpA7KB2hpIvVigmW72HV8wNL9P",
            "usage_metadata": {
                "input_tokens": 4576,
                "output_tokens": 25,
                "total_tokens": 4601,
                "input_token_details": {
                    "audio": 0,
                    "cache_read": 0
                },
                "output_token_details": {
                    "audio": 0,
                    "reasoning": 0
                }
            },
            "tool_calls": [
                {
                    "name": "clickTool",
                    "args": {
                        "elementID": "zRwx",
                        "purpose": "View the repository details."
                    },
                    "id": "call_G7Y2szh9hcT5cRXWLwR3KKxF",
                    "type": "tool_call"
                }
            ],
            "invalid_tool_calls": []
        }
    },
    {
        "type": "tool",
        "data": {
            "content": "{\n  \"status\": \"success\",\n  \"message\": \"页面跳转\"\n}",
            "tool_call_id": "call_G7Y2szh9hcT5cRXWLwR3KKxF",
            "name": "clickTool",
            "additional_kwargs": {},
            "response_metadata": {}
        }
    },
    {
        "type": "ai",
        "data": {
            "content": "",
            "additional_kwargs": {
                "tool_calls": [
                    {
                        "index": 0,
                        "id": "call_HVUX0NPMRPmk0mT2PMMmjti4",
                        "type": "function",
                        "function": {
                            "name": "clickTool",
                            "arguments": "{\"elementID\":\"Q8gD\",\"purpose\":\"Check the stars of the repositories.\"}"
                        }
                    }
                ]
            },
            "response_metadata": {
                "estimatedTokenUsage": {
                    "promptTokens": 12142,
                    "completionTokens": 0,
                    "totalTokens": 12142
                },
                "prompt": 0,
                "completion": 0,
                "finish_reason": "tool_calls",
                "system_fingerprint": "fp_0705bf87c0",
                "usage": {
                    "prompt_tokens": 12521,
                    "completion_tokens": 28,
                    "total_tokens": 12549,
                    "prompt_tokens_details": {
                        "cached_tokens": 0,
                        "audio_tokens": 0
                    },
                    "completion_tokens_details": {
                        "reasoning_tokens": 0,
                        "audio_tokens": 0,
                        "accepted_prediction_tokens": 0,
                        "rejected_prediction_tokens": 0
                    }
                }
            },
            "tool_call_chunks": [
                {
                    "name": "clickTool",
                    "args": "{\"elementID\":\"Q8gD\",\"purpose\":\"Check the stars of the repositories.\"}",
                    "id": "call_HVUX0NPMRPmk0mT2PMMmjti4",
                    "index": 0,
                    "type": "tool_call_chunk"
                }
            ],
            "id": "chatcmpl-AaHIwNemolxzKhs5186ufgY1be4Rf",
            "usage_metadata": {
                "input_tokens": 12521,
                "output_tokens": 28,
                "total_tokens": 12549,
                "input_token_details": {
                    "audio": 0,
                    "cache_read": 0
                },
                "output_token_details": {
                    "audio": 0,
                    "reasoning": 0
                }
            },
            "tool_calls": [
                {
                    "name": "clickTool",
                    "args": {
                        "elementID": "Q8gD",
                        "purpose": "Check the stars of the repositories."
                    },
                    "id": "call_HVUX0NPMRPmk0mT2PMMmjti4",
                    "type": "tool_call"
                }
            ],
            "invalid_tool_calls": []
        }
    },
    {
        "type": "tool",
        "data": {
            "content": "{\n  \"status\": \"fail\",\n  \"message\": \"Cannot read properties of null (reading 'contentDocument')\"\n}",
            "tool_call_id": "call_HVUX0NPMRPmk0mT2PMMmjti4",
            "name": "clickTool",
            "additional_kwargs": {},
            "response_metadata": {}
        }
    },
    {
        "type": "ai",
        "data": {
            "content": "It seems that I'm currently unable to retrieve the information about the repositories where you made contributions and that have more than 100 stars. The page navigation is encountering issues.\n\nIf you have access to the repository list, you might want to check the star counts directly there. Alternatively, if you can provide me with specific repository names or details, I can assist you further!",
            "additional_kwargs": {},
            "response_metadata": {
                "estimatedTokenUsage": {
                    "promptTokens": 12179,
                    "completionTokens": 73,
                    "totalTokens": 12252
                },
                "prompt": 0,
                "completion": 0,
                "finish_reason": "stop",
                "system_fingerprint": "fp_0705bf87c0",
                "usage": {
                    "prompt_tokens": 12583,
                    "completion_tokens": 74,
                    "total_tokens": 12657,
                    "prompt_tokens_details": {
                        "cached_tokens": 12416,
                        "audio_tokens": 0
                    },
                    "completion_tokens_details": {
                        "reasoning_tokens": 0,
                        "audio_tokens": 0,
                        "accepted_prediction_tokens": 0,
                        "rejected_prediction_tokens": 0
                    }
                }
            },
            "tool_call_chunks": [],
            "id": "chatcmpl-AaHIyLzhFTdJSBHP3j2Q56f3WWTGB",
            "usage_metadata": {
                "input_tokens": 12583,
                "output_tokens": 74,
                "total_tokens": 12657,
                "input_token_details": {
                    "audio": 0,
                    "cache_read": 12416
                },
                "output_token_details": {
                    "audio": 0,
                    "reasoning": 0
                }
            },
            "tool_calls": [],
            "invalid_tool_calls": []
        }
    }
]